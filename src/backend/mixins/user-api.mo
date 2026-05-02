import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserTypes "../types/user";
import UserLib "../lib/userLib";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Principal, UserTypes.UserProfile>,
) {
  public shared ({ caller }) func updateUserProfile(input : UserTypes.UserProfileInput) : async UserTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.updateProfile(userProfiles, caller, input);
  };

  public query ({ caller }) func getUserProfile(userId : Principal) : async ?UserTypes.UserProfile {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized");
    };
    UserLib.getProfile(userProfiles, userId);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserTypes.UserProfile {
    UserLib.getProfile(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserTypes.UserProfileInput) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let existing = UserLib.getProfile(userProfiles, caller);
    let now = Time.now();
    let saved : UserTypes.UserProfile = switch (existing) {
      case (?p) {
        { p with name = profile.name; phone = profile.phone; email = profile.email };
      };
      case null {
        {
          id = caller;
          name = profile.name;
          phone = profile.phone;
          email = profile.email;
          role = profile.role;
          createdAt = now;
          verificationStatus = #unverified;
          blacklisted = false;
        };
      };
    };
    userProfiles.add(caller, saved);
  };

  public shared ({ caller }) func blacklistUser(userId : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    UserLib.blacklistUser(userProfiles, userId);
  };

  public query ({ caller }) func getAdminUsers() : async [UserTypes.UserProfile] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Admin only");
    };
    UserLib.listUsers(userProfiles);
  };
};
