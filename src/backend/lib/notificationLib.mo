import Map "mo:core/Map";
import Principal "mo:core/Principal";
import NotificationTypes "../types/notification";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

module {
  public func createNotification(
    notifications : Map.Map<Nat, NotificationTypes.Notification>,
    nextId : Nat,
    userId : Principal,
    notificationType : NotificationTypes.NotificationType,
    message : Text,
  ) : NotificationTypes.Notification {
    let notif : NotificationTypes.Notification = {
      id = nextId;
      userId;
      notificationType;
      message;
      read = false;
      createdAt = Time.now();
    };
    notifications.add(nextId, notif);
    notif;
  };

  public func getUserNotifications(
    notifications : Map.Map<Nat, NotificationTypes.Notification>,
    userId : Principal,
  ) : [NotificationTypes.Notification] {
    notifications.entries()
      .filter(func((_, n)) = Principal.equal(n.userId, userId))
      .map<(Nat, NotificationTypes.Notification), NotificationTypes.Notification>(func((_, n)) = n)
      .toArray();
  };

  public func markRead(
    notifications : Map.Map<Nat, NotificationTypes.Notification>,
    notificationId : Nat,
    userId : Principal,
  ) : () {
    let existing = switch (notifications.get(notificationId)) {
      case (?n) n;
      case null Runtime.trap("Notification not found");
    };
    if (not Principal.equal(existing.userId, userId)) {
      Runtime.trap("Unauthorized: not your notification");
    };
    let updated : NotificationTypes.Notification = { existing with read = true };
    notifications.add(notificationId, updated);
  };
};
