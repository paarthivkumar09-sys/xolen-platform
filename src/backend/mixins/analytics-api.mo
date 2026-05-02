import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import BookingTypes "../types/booking";
import PropertyTypes "../types/property";
import UserTypes "../types/user";
import AnalyticsTypes "../types/analytics";
import AnalyticsLib "../lib/analyticsLib";
import List "mo:core/List";

mixin (
  accessControlState : AccessControl.AccessControlState,
  bookings : Map.Map<Nat, BookingTypes.Booking>,
  payments : Map.Map<Nat, BookingTypes.Payment>,
  properties : Map.Map<Nat, PropertyTypes.Property>,
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public query ({ caller }) func getAdminAnalytics() : async AnalyticsTypes.AdminAnalytics {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can view analytics");
    };
    AnalyticsLib.getAdminAnalytics(bookings, properties, userProfiles, payments);
  };

  public query ({ caller }) func getOwnerEarnings() : async AnalyticsTypes.OwnerEarnings {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    let ownerPropertyIdList = List.empty<Nat>();
    for ((id, p) in properties.entries()) {
      if (Principal.equal(p.ownerId, caller)) { ownerPropertyIdList.add(id) };
    };
    let ownerPropertyIds = ownerPropertyIdList.toArray();
    AnalyticsLib.getOwnerEarnings(bookings, payments, caller, ownerPropertyIds);
  };
};
