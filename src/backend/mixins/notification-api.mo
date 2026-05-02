import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import NotificationTypes "../types/notification";
import NotificationLib "../lib/notificationLib";

mixin (
  accessControlState : AccessControl.AccessControlState,
  notifications : Map.Map<Nat, NotificationTypes.Notification>,
) {
  public query ({ caller }) func getNotifications() : async [NotificationTypes.Notification] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    NotificationLib.getUserNotifications(notifications, caller);
  };

  public shared ({ caller }) func markNotificationRead(notificationId : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    NotificationLib.markRead(notifications, notificationId, caller);
  };
};
