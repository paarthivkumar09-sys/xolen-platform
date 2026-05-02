import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type PaymentStatus = {
    #pending;
    #success;
    #failed;
  };

  public type DecisionStatus = {
    #pending;
    #accepted;
    #refunded;
    #expired;
  };

  public type ServiceAddon = {
    serviceId : Nat;
    serviceName : Text;
    price : Nat;
  };

  public type Booking = {
    id : Nat;
    customerId : Principal;
    propertyId : Nat;
    checkIn : Int;
    checkOut : Int;
    totalDays : Nat;
    totalPrice : Nat;
    serviceAddons : [ServiceAddon];
    paymentStatus : PaymentStatus;
    decisionStatus : DecisionStatus;
    decisionDeadline : Int;
    createdAt : Int;
    invoiceUrl : ?Text;
  };

  public type BookingInput = {
    propertyId : Nat;
    checkIn : Int;
    totalDays : Nat;
    serviceAddonIds : [Nat];
  };

  public type DecisionInput = {
    bookingId : Nat;
    decision : DecisionStatus;
  };

  public type PaymentMethod = {
    #upi;
    #card;
    #wallet;
  };

  public type Payment = {
    id : Nat;
    bookingId : Nat;
    amount : Nat;
    paymentMethod : PaymentMethod;
    status : PaymentStatus;
    createdAt : Int;
    holdReleaseAt : Int;
  };

  public type PendingPayout = {
    bookingId : Nat;
    amount : Nat;
    ownerId : Principal;
    releaseAt : Int;
    processed : Bool;
  };

  public type PaymentInput = {
    bookingId : Nat;
    amount : Nat;
    paymentMethod : PaymentMethod;
  };
};
