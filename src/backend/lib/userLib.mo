import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import UserTypes "../types/user";

module {
  public func getProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    userId : Principal,
  ) : ?UserTypes.UserProfile {
    profiles.get(userId);
  };

  public func updateProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    userId : Principal,
    input : UserTypes.UserProfileInput,
  ) : UserTypes.UserProfile {
    let existing = switch (profiles.get(userId)) {
      case (?p) p;
      case null Runtime.trap("Profile not found");
    };
    let updated : UserTypes.UserProfile = {
      existing with
      name = input.name;
      phone = input.phone;
      email = input.email;
    };
    profiles.add(userId, updated);
    updated;
  };

  public func blacklistUser(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    userId : Principal,
  ) : () {
    switch (profiles.get(userId)) {
      case (?p) {
        profiles.add(userId, { p with blacklisted = true });
      };
      case null Runtime.trap("User not found");
    };
  };

  public func listUsers(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
  ) : [UserTypes.UserProfile] {
    profiles.values().toArray();
  };

  public func ensureProfile(
    profiles : Map.Map<Principal, UserTypes.UserProfile>,
    caller : Principal,
    role : UserTypes.UserRole,
  ) : UserTypes.UserProfile {
    switch (profiles.get(caller)) {
      case (?p) p;
      case null {
        let p : UserTypes.UserProfile = {
          id = caller;
          name = "";
          phone = "";
          email = "";
          role = role;
          createdAt = Time.now();
          verificationStatus = #unverified;
          blacklisted = false;
        };
        profiles.add(caller, p);
        p;
      };
    };
  };
};
