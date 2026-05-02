import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type DocType = {
    #aadhaar;
    #passport;
    #drivingLicense;
    #other;
  };

  public type UploadedBy = {
    #customer;
    #executive;
  };

  public type DocVerificationStatus = {
    #pending;
    #verified;
    #rejected;
  };

  public type Document = {
    id : Nat;
    bookingId : Nat;
    ownerId : Principal;
    docType : DocType;
    fileBlob : Storage.ExternalBlob;
    uploadedBy : UploadedBy;
    uploadedAt : Int;
    verificationStatus : DocVerificationStatus;
  };

  public type DocumentInput = {
    bookingId : Nat;
    docType : DocType;
    fileBlob : Storage.ExternalBlob;
    uploadedBy : UploadedBy;
  };
};
