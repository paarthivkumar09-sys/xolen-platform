import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type TaskType = {
    #propertyVerification;
    #customerCheckin;
  };

  public type TaskStatus = {
    #pending;
    #inProgress;
    #completed;
  };

  public type VerificationTask = {
    id : Nat;
    propertyId : Nat;
    executiveId : Principal;
    taskType : TaskType;
    status : TaskStatus;
    photos : [Storage.ExternalBlob];
    notes : ?Text;
    createdAt : Int;
    completedAt : ?Int;
    bookingId : ?Nat;
  };

  public type TaskInput = {
    propertyId : Nat;
    executiveId : Principal;
    taskType : TaskType;
    bookingId : ?Nat;
  };
};
