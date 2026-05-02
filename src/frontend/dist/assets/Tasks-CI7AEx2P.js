import { d as useActor, r as reactExports, Y as TaskStatus, e as useQuery, j as jsxRuntimeExports, Z as SquareCheckBig, $ as TaskType, i as Link, f as createActor } from "./index-Dtbu2WTs.js";
import { S as SkeletonCard } from "./SkeletonCard-5UjpY3_A.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { B as Badge } from "./badge-BY7OGQ7n.js";
import { C as ClipboardList, U as UserCheck } from "./user-check-DbjfBETp.js";
import { M as MapPin } from "./map-pin-CehLSmlL.js";
import { C as ChevronRight } from "./chevron-right-CuGYFeKb.js";
import "./skeleton-BQPfBTkU.js";
import "./index-fYYCyfxq.js";
const TABS = [
  { label: "Pending", value: TaskStatus.pending },
  { label: "In Progress", value: TaskStatus.inProgress },
  { label: "Completed", value: TaskStatus.completed }
];
function TaskCard({ task, index }) {
  const isVerification = task.taskType === TaskType.propertyVerification;
  const isCompleted = task.status === TaskStatus.completed;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/executive/task/$id",
      params: { id: String(task.id) },
      "data-ocid": `exec_task.item.${index + 1}`,
      className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-smooth hover:shadow-md active:scale-[0.99]",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isVerification ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`,
            children: isVerification ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "h-6 w-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "h-6 w-6" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm leading-tight", children: isVerification ? "Property Verification" : "Customer Check-in" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: task.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex items-center gap-1 text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "truncate text-xs", children: [
              "Property #",
              String(task.propertyId)
            ] })
          ] }),
          task.bookingId && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-xs text-muted-foreground", children: [
            "Booking #",
            String(task.bookingId)
          ] })
        ] }),
        !isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
      ]
    }
  );
}
function ExecutiveTasks() {
  const { actor, isFetching } = useActor(createActor);
  const [activeTab, setActiveTab] = reactExports.useState(TaskStatus.pending);
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15e3
  });
  const byStatus = (status) => (tasks == null ? void 0 : tasks.filter((t) => t.status === status)) ?? [];
  const tabTasks = byStatus(activeTab);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "My Tasks" }),
      tasks && tasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
        tasks.length,
        " total"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-xl bg-muted p-1 gap-1", role: "tablist", children: TABS.map((tab) => {
      const count = byStatus(tab.value).length;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": activeTab === tab.value,
          "data-ocid": `exec_tasks.${tab.label.toLowerCase().replace(" ", "_")}.tab`,
          onClick: () => setActiveTab(tab.value),
          className: `flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-smooth ${activeTab === tab.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
          children: [
            tab.label,
            count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold ${activeTab === tab.value ? "bg-primary text-primary-foreground" : "bg-muted-foreground/20 text-muted-foreground"}`,
                children: count
              }
            )
          ]
        },
        tab.value
      );
    }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)) }) : tabTasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-16 text-center",
        "data-ocid": "exec_tasks.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "mb-3 h-10 w-10 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
            "No",
            " ",
            activeTab === TaskStatus.pending ? "pending" : activeTab === TaskStatus.inProgress ? "in-progress" : "completed",
            " ",
            "tasks"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: activeTab !== TaskStatus.completed ? "Tasks assigned to you will appear here" : "Completed tasks will appear here" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: tabTasks.map((task, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TaskCard, { task, index: i }, String(task.id))) })
  ] });
}
export {
  ExecutiveTasks as default
};
