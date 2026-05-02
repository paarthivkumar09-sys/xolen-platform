import Map "mo:core/Map";
import Principal "mo:core/Principal";
import BookingTypes "../types/booking";
import Time "mo:core/Time";
import List "mo:core/List";

module {
  public func createPayment(
    payments : Map.Map<Nat, BookingTypes.Payment>,
    nextId : Nat,
    input : BookingTypes.PaymentInput,
  ) : BookingTypes.Payment {
    let now = Time.now();
    // Simulate payment — always succeeds (UPI/Card/Wallet)
    let holdReleaseAt = now + (24 * 60 * 60 * 1_000_000_000); // 24 hours hold
    let payment : BookingTypes.Payment = {
      id = nextId;
      bookingId = input.bookingId;
      amount = input.amount;
      paymentMethod = input.paymentMethod;
      status = #success;
      createdAt = now;
      holdReleaseAt;
    };
    payments.add(nextId, payment);
    payment;
  };

  public func getCustomerPayments(
    payments : Map.Map<Nat, BookingTypes.Payment>,
    bookings : Map.Map<Nat, BookingTypes.Booking>,
    customerId : Principal,
  ) : [BookingTypes.Payment] {
    let result = List.empty<BookingTypes.Payment>();
    for ((_, p) in payments.entries()) {
      switch (bookings.get(p.bookingId)) {
        case (?b) {
          if (Principal.equal(b.customerId, customerId)) {
            result.add(p);
          };
        };
        case null {};
      };
    };
    result.toArray();
  };

  public func listAllPayments(
    payments : Map.Map<Nat, BookingTypes.Payment>,
  ) : [BookingTypes.Payment] {
    let result = List.empty<BookingTypes.Payment>();
    for ((_, p) in payments.entries()) {
      result.add(p);
    };
    result.toArray();
  };
};
