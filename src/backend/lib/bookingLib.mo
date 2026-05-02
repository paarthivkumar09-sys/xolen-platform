import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import BookingTypes "../types/booking";
import ServiceTypes "../types/service";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

module {
  public func createBooking(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    nextId : Nat,
    customerId : Principal,
    input : BookingTypes.BookingInput,
    services : Map.Map<Nat, ServiceTypes.Service>,
    perDayPrice : Nat,
  ) : BookingTypes.Booking {
    if (input.totalDays < 15) {
      Runtime.trap("Minimum stay is 15 days");
    };
    // Resolve service add-ons
    let addons : [BookingTypes.ServiceAddon] = input.serviceAddonIds.filterMap(
      func(sid : Nat) : ?BookingTypes.ServiceAddon {
        switch (services.get(sid)) {
          case (?s) { ?{ serviceId = s.id; serviceName = s.name; price = s.price } };
          case null { null };
        };
      }
    );
    var addonsTotal : Nat = 0;
    for (a in addons.values()) { addonsTotal += a.price };
    let now = Time.now();
    let checkOut = input.checkIn + (input.totalDays * 24 * 60 * 60 * 1_000_000_000);
    let decisionDeadline = now + (25 * 60 * 1_000_000_000); // 25 minutes
    let totalPrice = perDayPrice * input.totalDays + addonsTotal;
    let booking : BookingTypes.Booking = {
      id = nextId;
      customerId;
      propertyId = input.propertyId;
      checkIn = input.checkIn;
      checkOut;
      totalDays = input.totalDays;
      totalPrice;
      serviceAddons = addons;
      paymentStatus = #pending;
      decisionStatus = #pending;
      decisionDeadline;
      createdAt = now;
      invoiceUrl = null;
    };
    bookings.add(nextId, booking);
    booking;
  };

  public func getBooking(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    bookingId : Nat,
  ) : ?BookingTypes.Booking {
    switch (bookings.get(bookingId)) {
      case (?b) {
        // Auto-expire if deadline passed and still pending
        let now = Time.now();
        if (b.decisionStatus == #pending and b.decisionDeadline < now) {
          let expired = { b with decisionStatus = #expired };
          bookings.add(bookingId, expired);
          ?expired;
        } else {
          ?b;
        };
      };
      case null { null };
    };
  };

  public func getCustomerBookings(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    customerId : Principal,
  ) : [BookingTypes.Booking] {
    let now = Time.now();
    let result = List.empty<BookingTypes.Booking>();
    // Collect entries first, then update expired ones
    let entries = List.empty<(Nat, BookingTypes.Booking)>();
    for ((id, b) in bookings.entries()) {
      entries.add((id, b));
    };
    for ((id, b) in entries.values()) {
      if (Principal.equal(b.customerId, customerId)) {
        if (b.decisionStatus == #pending and b.decisionDeadline < now) {
          let expired = { b with decisionStatus = #expired };
          bookings.add(id, expired);
          result.add(expired);
        } else {
          result.add(b);
        };
      };
    };
    result.toArray();
  };

  public func processDecision(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    bookingId : Nat,
    caller : Principal,
    decision : BookingTypes.DecisionStatus,
  ) : BookingTypes.Booking {
    let booking = switch (bookings.get(bookingId)) {
      case (?b) { b };
      case null { Runtime.trap("Booking not found") };
    };
    if (not Principal.equal(booking.customerId, caller)) {
      Runtime.trap("Not your booking");
    };
    if (booking.decisionStatus != #pending) {
      Runtime.trap("Decision already made or expired");
    };
    let now = Time.now();
    if (booking.decisionDeadline < now) {
      // Auto-expire first
      let expired = { booking with decisionStatus = #expired };
      bookings.add(bookingId, expired);
      Runtime.trap("Decision window has expired");
    };
    // Only accept or refund are valid choices
    let newStatus : BookingTypes.DecisionStatus = switch (decision) {
      case (#accepted) { #accepted };
      case (#refunded) { #refunded };
      case (_) { Runtime.trap("Invalid decision") };
    };
    let updated = { booking with decisionStatus = newStatus };
    bookings.add(bookingId, updated);
    updated;
  };

  public func listAllBookings(
    bookings : Map.Map<Nat, BookingTypes.Booking>,
  ) : [BookingTypes.Booking] {
    let now = Time.now();
    let result = List.empty<BookingTypes.Booking>();
    let entries = List.empty<(Nat, BookingTypes.Booking)>();
    for ((id, b) in bookings.entries()) {
      entries.add((id, b));
    };
    for ((id, b) in entries.values()) {
      if (b.decisionStatus == #pending and b.decisionDeadline < now) {
        let expired = { b with decisionStatus = #expired };
        bookings.add(id, expired);
        result.add(expired);
      } else {
        result.add(b);
      };
    };
    result.toArray();
  };
};
