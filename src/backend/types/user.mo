import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type UserRole = {
    #customer;
    #owner;
    #admin;
    #executive;
  };

  public type VerificationStatus = {
    #unverified;
    #pending;
    #verified;
    #rejected;
  };

  public type UserProfile = {
    id : Principal;
    name : Text;
    phone : Text;
    email : Text;
    role : UserRole;
    createdAt : Int;
    verificationStatus : VerificationStatus;
    blacklisted : Bool;
  };

  public type UserProfileInput = {
    name : Text;
    phone : Text;
    email : Text;
    role : UserRole;
  };
};
