import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Storage "mo:caffeineai-object-storage/Storage";
import AccessControl "mo:caffeineai-authorization/access-control";
import TaskTypes "../types/task";
import TaskLib "../lib/taskLib";

mixin (
  accessControlState : AccessControl.AccessControlState,
  tasks : Map.Map<Nat, TaskTypes.VerificationTask>,
) {
  public shared ({ caller }) func createVerificationTask(input : TaskTypes.TaskInput) : async TaskTypes.VerificationTask {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create verification tasks");
    };
    let nextId = tasks.size() + 1;
    TaskLib.createTask(tasks, nextId, input);
  };

  public query ({ caller }) func getMyTasks() : async [TaskTypes.VerificationTask] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    TaskLib.getExecutiveTasks(tasks, caller);
  };

  public shared ({ caller }) func updateTaskStatus(taskId : Nat, status : TaskTypes.TaskStatus, notes : ?Text) : async TaskTypes.VerificationTask {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    TaskLib.updateTaskStatus(tasks, taskId, caller, status, notes);
  };

  public shared ({ caller }) func uploadVerificationPhoto(taskId : Nat, photo : Storage.ExternalBlob) : async TaskTypes.VerificationTask {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in");
    };
    TaskLib.uploadVerificationPhoto(tasks, taskId, caller, photo);
  };
};
