module {
  public type Rating = {
    id : Nat;
    bookingId : Nat;
    customerId : Principal;
    propertyId : Nat;
    rating : Nat;
    reviewText : Text;
    createdAt : Int;
  };

  public type RatingInput = {
    bookingId : Nat;
    propertyId : Nat;
    rating : Nat;
    reviewText : Text;
  };
};
