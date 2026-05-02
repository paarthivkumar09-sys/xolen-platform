import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "mo:caffeineai-object-storage/Storage";
import TaskTypes "../types/task";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

module {
  public func createTask(
    tasks : Map.Map<Nat, TaskTypes.VerificationTask>,
    nextId : Nat,
    input : TaskTypes.TaskInput,
  ) : TaskTypes.VerificationTask {
    let task : TaskTypes.VerificationTask = {
      id = nextId;
      propertyId = input.propertyId;
      executiveId = input.executiveId;
      taskType = input.taskType;
      status = #pending;
      photos = [];
      notes = null;
      createdAt = Time.now();
      completedAt = null;
      bookingId = input.bookingId;
    };
    tasks.add(nextId, task);
    task;
  };

  public func getExecutiveTasks(
    tasks : Map.Map<Nat, TaskTypes.VerificationTask>,
    executiveId : Principal,
  ) : [TaskTypes.VerificationTask] {
    tasks.entries()
      .filter(func((_, t)) = Principal.equal(t.executiveId, executiveId))
      .map<(Nat, TaskTypes.VerificationTask), TaskTypes.VerificationTask>(func((_, t)) = t)
      .toArray();
  };

  public func updateTaskStatus(
    tasks : Map.Map<Nat, TaskTypes.VerificationTask>,
    taskId : Nat,
    executiveId : Principal,
    status : TaskTypes.TaskStatus,
    notes : ?Text,
  ) : TaskTypes.VerificationTask {
    let existing = switch (tasks.get(taskId)) {
      case (?t) t;
      case null Runtime.trap("Task not found");
    };
    if (not Principal.equal(existing.executiveId, executiveId)) {
      Runtime.trap("Unauthorized: not your task");
    };
    let completedAt : ?Int = switch (status) {
      case (#completed) ?Time.now();
      case _ existing.completedAt;
    };
    let updated : TaskTypes.VerificationTask = {
      existing with
      status;
      notes;
      completedAt;
    };
    tasks.add(taskId, updated);
    updated;
  };

  public func uploadVerificationPhoto(
    tasks : Map.Map<Nat, TaskTypes.VerificationTask>,
    taskId : Nat,
    executiveId : Principal,
    photo : Storage.ExternalBlob,
  ) : TaskTypes.VerificationTask {
    let existing = switch (tasks.get(taskId)) {
      case (?t) t;
      case null Runtime.trap("Task not found");
    };
    if (not Principal.equal(existing.executiveId, executiveId)) {
      Runtime.trap("Unauthorized: not your task");
    };
    let updated : TaskTypes.VerificationTask = {
      existing with
      photos = existing.photos.concat([photo]);
    };
    tasks.add(taskId, updated);
    updated;
  };
};
