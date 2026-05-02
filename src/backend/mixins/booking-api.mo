import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingTypes "../types/booking";
import ServiceTypes "../types/service";
import PropertyTypes "../types/property";
import NotificationTypes "../types/notification";
import BookingLib "../lib/bookingLib";
import PaymentLib "../lib/paymentLib";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
  payments : Map.Map<Nat, BookingTypes.Payment>,
  services : Map.Map<Nat, ServiceTypes.Service>,
  properties : Map.Map<Nat, PropertyTypes.Property>,
  notifications : Map.Map<Nat, NotificationTypes.Notification>,
  nextBookingId : { var val : Nat },
  nextPaymentId : { var val : Nat },
  pendingPayouts : List.List<BookingTypes.PendingPayout>,
) {
  // ── helpers ─────────────────────────────────────────────

  func isAdmin(caller : Principal) : Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  func generateInvoiceUrl(bookingId : Nat) : Text {
    "https://xolen.in/invoice/" # bookingId.toText();
  };

  func scheduleOwnerPayout(bookingId : Nat, amount : Nat, ownerId : Principal, releaseAt : Int) {
    let payout : BookingTypes.PendingPayout = {
      bookingId;
      amount;
      ownerId;
      releaseAt;
      processed = false;
    };
    pendingPayouts.add(payout);
  };

  // ── seeding ─────────────────────────────────────────────
  // Sample data: called from main.mo after actor init
  public func seedSampleBookings(sampleCustomerId : Principal) : () {
    if (not bookings.isEmpty()) { return }; // only seed once
    let now = Time.now();
    let day = 24 * 60 * 60 * 1_000_000_000;
    let checkIn = now - (20 * day); // started 20 days ago

    // 3 accepted bookings
    let b1 : BookingTypes.Booking = {
      id = 1; customerId = sampleCustomerId; propertyId = 1;
      checkIn; checkOut = checkIn + (30 * day); totalDays = 30;
      totalPrice = 30_000; serviceAddons = [];
      paymentStatus = #success; decisionStatus = #accepted;
      decisionDeadline = checkIn + (25 * 60 * 1_000_000_000);
      createdAt = checkIn; invoiceUrl = ?generateInvoiceUrl(1);
    };
    let b2 : BookingTypes.Booking = {
      id = 2; customerId = sampleCustomerId; propertyId = 1;
      checkIn = now - (40 * day); checkOut = now - (10 * day); totalDays = 30;
      totalPrice = 30_000; serviceAddons = [];
      paymentStatus = #success; decisionStatus = #accepted;
      decisionDeadline = (now - (40 * day)) + (25 * 60 * 1_000_000_000);
      createdAt = now - (40 * day); invoiceUrl = ?generateInvoiceUrl(2);
    };
    let b3 : BookingTypes.Booking = {
      id = 3; customerId = sampleCustomerId; propertyId = 2;
      checkIn = now - (60 * day); checkOut = now - (30 * day); totalDays = 30;
      totalPrice = 45_000;
      serviceAddons = [{ serviceId = 1; serviceName = "AC Cleaning"; price = 999 }];
      paymentStatus = #success; decisionStatus = #accepted;
      decisionDeadline = (now - (60 * day)) + (25 * 60 * 1_000_000_000);
      createdAt = now - (60 * day); invoiceUrl = ?generateInvoiceUrl(3);
    };
    // 1 refunded
    let b4 : BookingTypes.Booking = {
      id = 4; customerId = sampleCustomerId; propertyId = 3;
      checkIn = now - (10 * day); checkOut = now + (5 * day); totalDays = 15;
      totalPrice = 15_000; serviceAddons = [];
      paymentStatus = #success; decisionStatus = #refunded;
      decisionDeadline = (now - (10 * day)) + (25 * 60 * 1_000_000_000);
      createdAt = now - (10 * day); invoiceUrl = ?generateInvoiceUrl(4);
    };
    // 1 pending decision (deadline in future)
    let futureDeadline = now + (20 * 60 * 1_000_000_000); // 20 min from now
    let b5 : BookingTypes.Booking = {
      id = 5; customerId = sampleCustomerId; propertyId = 1;
      checkIn = now; checkOut = now + (15 * day); totalDays = 15;
      totalPrice = 15_000; serviceAddons = [];
      paymentStatus = #success; decisionStatus = #pending;
      decisionDeadline = futureDeadline;
      createdAt = now; invoiceUrl = ?generateInvoiceUrl(5);
    };
    bookings.add(1, b1);
    bookings.add(2, b2);
    bookings.add(3, b3);
    bookings.add(4, b4);
    bookings.add(5, b5);
    nextBookingId.val := 6;

    // Sample payments
    let p1 : BookingTypes.Payment = {
      id = 1; bookingId = 1; amount = 30_000; paymentMethod = #upi;
      status = #success; createdAt = b1.createdAt;
      holdReleaseAt = b1.createdAt + (24 * 60 * 60 * 1_000_000_000);
    };
    let p2 : BookingTypes.Payment = {
      id = 2; bookingId = 2; amount = 30_000; paymentMethod = #card;
      status = #success; createdAt = b2.createdAt;
      holdReleaseAt = b2.createdAt + (24 * 60 * 60 * 1_000_000_000);
    };
    let p3 : BookingTypes.Payment = {
      id = 3; bookingId = 3; amount = 45_000; paymentMethod = #wallet;
      status = #success; createdAt = b3.createdAt;
      holdReleaseAt = b3.createdAt + (24 * 60 * 60 * 1_000_000_000);
    };
    let p4 : BookingTypes.Payment = {
      id = 4; bookingId = 4; amount = 15_000; paymentMethod = #upi;
      status = #success; createdAt = b4.createdAt;
      holdReleaseAt = b4.createdAt + (24 * 60 * 60 * 1_000_000_000);
    };
    let p5 : BookingTypes.Payment = {
      id = 5; bookingId = 5; amount = 15_000; paymentMethod = #card;
      status = #success; createdAt = b5.createdAt;
      holdReleaseAt = b5.createdAt + (24 * 60 * 60 * 1_000_000_000);
    };
    payments.add(1, p1);
    payments.add(2, p2);
    payments.add(3, p3);
    payments.add(4, p4);
    payments.add(5, p5);
    nextPaymentId.val := 6;
  };

  // ── public API ───────────────────────────────────────────

  public shared ({ caller }) func createBooking(input : BookingTypes.BookingInput) : async BookingTypes.Booking {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    // Check property exists and is verified
    let property = switch (properties.get(input.propertyId)) {
      case (?p) { p };
      case null { Runtime.trap("Property not found") };
    };
    if (property.status != #verified) { Runtime.trap("Property is not verified") };
    // Check availability: no overlapping accepted bookings for same property
    let checkOut = input.checkIn + (input.totalDays * 24 * 60 * 60 * 1_000_000_000);
    for ((_, b) in bookings.entries()) {
      if (b.propertyId == input.propertyId and (b.decisionStatus == #accepted or b.decisionStatus == #pending)) {
        // Overlap check: b.checkIn < checkOut AND b.checkOut > checkIn
        if (b.checkIn < checkOut and b.checkOut > input.checkIn) {
          Runtime.trap("Property not available for selected dates");
        };
      };
    };
    let id = nextBookingId.val;
    nextBookingId.val := nextBookingId.val + 1;
    let booking = BookingLib.createBooking(bookings, id, caller, input, services, property.perDayPrice);
    booking;
  };

  public query ({ caller }) func getBooking(bookingId : Nat) : async ?BookingTypes.Booking {
    // Note: query cannot mutate state, so auto-expire is read-only here
    bookings.get(bookingId);
  };

  public query ({ caller }) func getMyBookings() : async [BookingTypes.Booking] {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    let result = List.empty<BookingTypes.Booking>();
    let now = Time.now();
    for ((_, b) in bookings.entries()) {
      if (Principal.equal(b.customerId, caller)) {
        if (b.decisionStatus == #pending and b.decisionDeadline < now) {
          result.add({ b with decisionStatus = #expired });
        } else {
          result.add(b);
        };
      };
    };
    result.toArray();
  };

  public shared ({ caller }) func processDecision(bookingId : Nat, decision : BookingTypes.DecisionStatus) : async BookingTypes.Booking {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    BookingLib.processDecision(bookings, bookingId, caller, decision);
  };

  public shared ({ caller }) func createPayment(input : BookingTypes.PaymentInput) : async BookingTypes.Payment {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    // Validate booking belongs to caller
    let booking = switch (bookings.get(input.bookingId)) {
      case (?b) { b };
      case null { Runtime.trap("Booking not found") };
    };
    if (not Principal.equal(booking.customerId, caller)) {
      Runtime.trap("Not your booking");
    };
    if (booking.paymentStatus == #success) {
      Runtime.trap("Already paid");
    };
    let id = nextPaymentId.val;
    nextPaymentId.val += 1;
    let payment = PaymentLib.createPayment(payments, id, input);
    // Update booking: mark payment success + add invoice URL
    let invoiceUrl = generateInvoiceUrl(booking.id);
    let updatedBooking = { booking with paymentStatus = #success; invoiceUrl = ?invoiceUrl };
    bookings.add(booking.id, updatedBooking);
    // Schedule owner payout
    let property = properties.get(booking.propertyId);
    switch (property) {
      case (?p) { scheduleOwnerPayout(booking.id, booking.totalPrice, p.ownerId, payment.holdReleaseAt) };
      case null {};
    };
    payment;
  };

  public query ({ caller }) func getMyPayments() : async [BookingTypes.Payment] {
    if (caller.isAnonymous()) { Runtime.trap("Not authenticated") };
    PaymentLib.getCustomerPayments(payments, bookings, caller);
  };

  public query ({ caller }) func getAdminPayments() : async [BookingTypes.Payment] {
    if (not isAdmin(caller)) { Runtime.trap("Admin access required") };
    PaymentLib.listAllPayments(payments);
  };

  public query ({ caller }) func getAdminBookings() : async [BookingTypes.Booking] {
    if (not isAdmin(caller)) { Runtime.trap("Admin access required") };
    BookingLib.listAllBookings(bookings);
  };

  public query ({ caller }) func getPendingPayouts() : async [BookingTypes.PendingPayout] {
    if (not isAdmin(caller)) { Runtime.trap("Admin access required") };
    let result = List.empty<BookingTypes.PendingPayout>();
    for (p in pendingPayouts.values()) {
      result.add(p);
    };
    result.toArray();
  };

  public shared ({ caller }) func markPayoutProcessed(bookingId : Nat) : async () {
    if (not isAdmin(caller)) { Runtime.trap("Admin access required") };
    pendingPayouts.mapInPlace(func(p : BookingTypes.PendingPayout) : BookingTypes.PendingPayout {
      if (p.bookingId == bookingId) { { p with processed = true } } else { p };
    });
  };

};
