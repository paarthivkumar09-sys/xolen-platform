module {
  public type NotificationType = {
    #bookingConfirmed;
    #paymentSuccess;
    #visitReminder;
    #extendReminder;
    #refundProcessed;
    #docUploaded;
  };

  public type Notification = {
    id : Nat;
    userId : Principal;
    notificationType : NotificationType;
    message : Text;
    read : Bool;
    createdAt : Int;
  };
};
