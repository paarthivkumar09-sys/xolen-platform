import { createActor } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { VerificationTask } from "@/types";
import { TaskStatus, TaskType } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Loader2,
  MapPin,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function ExecutiveTaskDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const { data: tasks, isLoading } = useQuery<VerificationTask[]>({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching,
  });

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTaskStatus(BigInt(id), TaskStatus.inProgress, null);
    },
    onSuccess: () => {
      toast.success("Task accepted! It is now in progress.");
      qc.invalidateQueries({ queryKey: ["myTasks"] });
    },
    onError: () => toast.error("Failed to accept task"),
  });

  const task = tasks?.find((t) => String(t.id) === id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Task not found</p>
        <Link
          to="/executive/tasks"
          className="mt-3 inline-block text-sm text-primary underline"
        >
          Back to Tasks
        </Link>
      </div>
    );
  }

  const isVerification = task.taskType === TaskType.propertyVerification;
  const isPending = task.status === TaskStatus.pending;
  const isInProgress = task.status === TaskStatus.inProgress;
  const isCompleted = task.status === TaskStatus.completed;

  const createdDate = new Date(
    Number(task.createdAt) / 1_000_000,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const completedDate = task.completedAt
    ? new Date(Number(task.completedAt) / 1_000_000).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "short", year: "numeric" },
      )
    : null;

  return (
    <div className="space-y-4">
      {/* Back nav + header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/executive/tasks" })}
          data-ocid="exec_task_detail.back_button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-smooth hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-xl font-bold truncate">
            {isVerification ? "Property Verification" : "Customer Check-in"}
          </h1>
          <p className="text-xs text-muted-foreground">Task #{id}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Task details card */}
      <div className="rounded-2xl border border-border bg-card">
        <div
          className={`flex items-center gap-3 rounded-t-2xl px-4 py-3 ${
            isVerification ? "bg-primary/5" : "bg-secondary/5"
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isVerification
                ? "bg-primary/10 text-primary"
                : "bg-secondary/10 text-secondary"
            }`}
          >
            {isVerification ? (
              <ClipboardList className="h-5 w-5" />
            ) : (
              <UserCheck className="h-5 w-5" />
            )}
          </div>
          <p className="font-semibold">
            {isVerification
              ? "Property Verification Task"
              : "Customer Check-in Task"}
          </p>
        </div>
        <div className="divide-y divide-border px-4">
          <InfoRow
            icon={<MapPin className="h-4 w-4" />}
            label="Property"
            value={`Property #${String(task.propertyId)}`}
          />
          {task.bookingId && (
            <InfoRow
              icon={<UserCheck className="h-4 w-4" />}
              label="Booking"
              value={`#${String(task.bookingId)}`}
            />
          )}
          <InfoRow
            icon={<Calendar className="h-4 w-4" />}
            label="Assigned On"
            value={createdDate}
          />
          {completedDate && (
            <InfoRow
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Completed On"
              value={completedDate}
            />
          )}
        </div>
        {task.notes && (
          <div className="rounded-b-2xl bg-muted/40 px-4 py-3">
            <p className="text-xs font-medium text-muted-foreground">Notes</p>
            <p className="mt-0.5 text-sm">{task.notes}</p>
          </div>
        )}
      </div>

      {/* Navigate button */}
      <button
        type="button"
        data-ocid="exec_task_detail.navigate_button"
        onClick={() => {
          const query = `Property ${String(task.propertyId)} Bhubaneswar`;
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
            "_blank",
          );
        }}
        className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-left transition-smooth hover:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">Navigate to Property</p>
            <p className="text-xs text-muted-foreground">Open in Google Maps</p>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Action buttons */}
      {isPending && (
        <Button
          type="button"
          data-ocid="exec_task_detail.accept_button"
          onClick={() => acceptMutation.mutate()}
          disabled={acceptMutation.isPending}
          className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold"
        >
          {acceptMutation.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Accept Task"
          )}
        </Button>
      )}

      {isInProgress && (
        <Button
          type="button"
          data-ocid={
            isVerification
              ? "exec_task_detail.verify_button"
              : "exec_task_detail.checkin_button"
          }
          onClick={() =>
            navigate({
              to: isVerification
                ? "/executive/task/$id/verify"
                : "/executive/task/$id/checkin",
              params: { id },
            })
          }
          className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold"
        >
          {isVerification ? (
            <>
              <Camera className="mr-2 h-5 w-5" /> Start Verification
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-5 w-5" /> Start Check-in
            </>
          )}
        </Button>
      )}

      {isCompleted && (
        <div
          data-ocid="exec_task_detail.success_state"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-5 text-emerald-700"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">Task Completed</span>
        </div>
      )}
    </div>
  );
}
