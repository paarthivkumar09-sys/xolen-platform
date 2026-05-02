import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import RatingTypes "../types/rating";
import RatingLib "../lib/ratingLib";
import UserTypes "../types/user";

mixin (
  accessControlState : AccessControl.AccessControlState,
  ratings : Map.Map<Nat, RatingTypes.Rating>,
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public shared ({ caller }) func submitRating(input : RatingTypes.RatingInput) : async RatingTypes.Rating {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to submit rating");
    };
    let profile = switch (userProfiles.get(caller)) {
      case (?p) p;
      case null Runtime.trap("User profile not found");
    };
    switch (profile.role) {
      case (#customer) {};
      case _ Runtime.trap("Unauthorized: Only customers can submit ratings");
    };
    let nextId = ratings.size() + 1;
    RatingLib.submitRating(ratings, nextId, caller, input);
  };

  public query func getPropertyRatings(propertyId : Nat) : async [RatingTypes.Rating] {
    RatingLib.getPropertyRatings(ratings, propertyId);
  };
};
