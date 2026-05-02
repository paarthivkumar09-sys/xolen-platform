import Map "mo:core/Map";
import Principal "mo:core/Principal";
import RatingTypes "../types/rating";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

module {
  public func submitRating(
    ratings : Map.Map<Nat, RatingTypes.Rating>,
    nextId : Nat,
    caller : Principal,
    input : RatingTypes.RatingInput,
  ) : RatingTypes.Rating {
    if (input.rating < 1 or input.rating > 5) {
      Runtime.trap("Rating must be between 1 and 5");
    };
    let rating : RatingTypes.Rating = {
      id = nextId;
      bookingId = input.bookingId;
      customerId = caller;
      propertyId = input.propertyId;
      rating = input.rating;
      reviewText = input.reviewText;
      createdAt = Time.now();
    };
    ratings.add(nextId, rating);
    rating;
  };

  public func getPropertyRatings(
    ratings : Map.Map<Nat, RatingTypes.Rating>,
    propertyId : Nat,
  ) : [RatingTypes.Rating] {
    ratings.entries()
      .filter(func((_, r)) = r.propertyId == propertyId)
      .map<(Nat, RatingTypes.Rating), RatingTypes.Rating>(func((_, r)) = r)
      .toArray();
  };
};
