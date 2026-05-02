import { createActor } from "@/backend";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import type { VerificationTask } from "@/types";
import { TaskStatus, TaskType } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  CheckSquare,
  ChevronRight,
  ClipboardList,
  MapPin,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

const TABS = [
  { label: "Pending", value: TaskStatus.pending },
  { label: "In Progress", value: TaskStatus.inProgress },
  { label: "Completed", value: TaskStatus.completed },
] as const;

function TaskCard({ task, index }: { task: VerificationTask; index: number }) {
  const isVerification = task.taskType === TaskType.propertyVerification;
  const isCompleted = task.status === TaskStatus.completed;

  return (
    <Link
      to="/executive/task/$id"
      params={{ id: String(task.id) }}
      data-ocid={`exec_task.item.${index + 1}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-smooth hover:shadow-md active:scale-[0.99]"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
          isVerification
            ? "bg-primary/10 text-primary"
            : "bg-secondary/10 text-secondary"
        }`}
      >
        {isVerification ? (
          <ClipboardList className="h-6 w-6" />
        ) : (
          <UserCheck className="h-6 w-6" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-sm leading-tight">
            {isVerification ? "Property Verification" : "Customer Check-in"}
          </p>
          <StatusBadge status={task.status} />
        </div>
        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate text-xs">
            Property #{String(task.propertyId)}
          </span>
        </div>
        {task.bookingId && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Booking #{String(task.bookingId)}
          </p>
        )}
      </div>
      {!isCompleted && (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </Link>
  );
}

export default function ExecutiveTasks() {
  const { actor, isFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = useState<TaskStatus>(TaskStatus.pending);

  const { data: tasks, isLoading } = useQuery<VerificationTask[]>({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15_000,
  });

  const byStatus = (status: TaskStatus) =>
    tasks?.filter((t) => t.status === status) ?? [];

  const tabTasks = byStatus(activeTab);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">My Tasks</h1>
        {tasks && tasks.length > 0 && (
          <Badge variant="secondary" className="text-xs">
            {tasks.length} total
          </Badge>
        )}
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-muted p-1 gap-1" role="tablist">
        {TABS.map((tab) => {
          const count = byStatus(tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              data-ocid={`exec_tasks.${tab.label.toLowerCase().replace(" ", "_")}.tab`}
              onClick={() => setActiveTab(tab.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-smooth ${
                activeTab === tab.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={`inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Task list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : tabTasks.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 text-center"
          data-ocid="exec_tasks.empty_state"
        >
          <CheckSquare className="mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-bold">
            No{" "}
            {activeTab === TaskStatus.pending
              ? "pending"
              : activeTab === TaskStatus.inProgress
                ? "in-progress"
                : "completed"}{" "}
            tasks
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeTab !== TaskStatus.completed
              ? "Tasks assigned to you will appear here"
              : "Completed tasks will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tabTasks.map((task, i) => (
            <TaskCard key={String(task.id)} task={task} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
