import { c as createLucideIcon, l as useParams, a as useNavigate, d as useActor, m as useQueryClient, e as useQuery, n as useMutation, j as jsxRuntimeExports, i as Link, $ as TaskType, Y as TaskStatus, L as LoaderCircle, b as ue, f as createActor } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { A as ArrowLeft } from "./arrow-left-BDd94EwB.js";
import { C as ClipboardList, U as UserCheck } from "./user-check-DbjfBETp.js";
import { M as MapPin } from "./map-pin-CehLSmlL.js";
import { C as Calendar } from "./calendar-PDHFpj3O.js";
import { C as CircleCheck } from "./circle-check-B7IaRigW.js";
import { C as Camera } from "./camera-CIse_KJh.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
function InfoRow({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 py-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 text-muted-foreground", children: icon }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: value })
    ] })
  ] });
}
function ExecutiveTaskDetail() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching
  });
  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTaskStatus(BigInt(id), TaskStatus.inProgress, null);
    },
    onSuccess: () => {
      ue.success("Task accepted! It is now in progress.");
      qc.invalidateQueries({ queryKey: ["myTasks"] });
    },
    onError: () => ue.error("Failed to accept task")
  });
  const task = tasks == null ? void 0 : tasks.find((t) => String(t.id) === id);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12" })
    ] });
  }
  if (!task) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Task not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/executive/tasks",
          className: "mt-3 inline-block text-sm text-primary underline",
          children: "Back to Tasks"
        }
      )
    ] });
  }
  const isVerification = task.taskType === TaskType.propertyVerification;
  const isPending = task.status === TaskStatus.pending;
  const isInProgress = task.status === TaskStatus.inProgress;
  const isCompleted = task.status === TaskStatus.completed;
  const createdDate = new Date(
    Number(task.createdAt) / 1e6
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const completedDate = task.completedAt ? new Date(Number(task.completedAt) / 1e6).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  ) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/executive/tasks" }),
          "data-ocid": "exec_task_detail.back_button",
          className: "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-smooth hover:bg-muted",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold truncate", children: isVerification ? "Property Verification" : "Customer Check-in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Task #",
          id
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: task.status })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-3 rounded-t-2xl px-4 py-3 ${isVerification ? "bg-primary/5" : "bg-secondary/5"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-10 w-10 items-center justify-center rounded-xl ${isVerification ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`,
                children: isVerification ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-5 w-5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: isVerification ? "Property Verification Task" : "Customer Check-in Task" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y divide-border px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
            label: "Property",
            value: `Property #${String(task.propertyId)}`
          }
        ),
        task.bookingId && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-4 w-4" }),
            label: "Booking",
            value: `#${String(task.bookingId)}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-4 w-4" }),
            label: "Assigned On",
            value: createdDate
          }
        ),
        completedDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoRow,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            label: "Completed On",
            value: completedDate
          }
        )
      ] }),
      task.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-b-2xl bg-muted/40 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm", children: task.notes })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "exec_task_detail.navigate_button",
        onClick: () => {
          const query = `Property ${String(task.propertyId)} Bhubaneswar`;
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
            "_blank"
          );
        },
        className: "flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-4 text-left transition-smooth hover:bg-muted/30",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: "Navigate to Property" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Open in Google Maps" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 text-muted-foreground" })
        ]
      }
    ),
    isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        "data-ocid": "exec_task_detail.accept_button",
        onClick: () => acceptMutation.mutate(),
        disabled: acceptMutation.isPending,
        className: "h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold",
        children: acceptMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }) : "Accept Task"
      }
    ),
    isInProgress && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        "data-ocid": isVerification ? "exec_task_detail.verify_button" : "exec_task_detail.checkin_button",
        onClick: () => navigate({
          to: isVerification ? "/executive/task/$id/verify" : "/executive/task/$id/checkin",
          params: { id }
        }),
        className: "h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold",
        children: isVerification ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "mr-2 h-5 w-5" }),
          " Start Verification"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "mr-2 h-5 w-5" }),
          " Start Check-in"
        ] })
      }
    ),
    isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "exec_task_detail.success_state",
        className: "flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-5 text-emerald-700",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Task Completed" })
        ]
      }
    )
  ] });
}
export {
  ExecutiveTaskDetail as default
};
