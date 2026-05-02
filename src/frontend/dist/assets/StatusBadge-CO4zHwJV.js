import { j as jsxRuntimeExports } from "./index-Dtbu2WTs.js";
const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200"
  },
  verified: {
    label: "Verified",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-200"
  },
  assigned: {
    label: "Assigned",
    className: "bg-blue-50 text-blue-700 ring-blue-200"
  },
  active: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
  },
  success: {
    label: "Success",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
  },
  failed: { label: "Failed", className: "bg-red-50 text-red-700 ring-red-200" },
  inProgress: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 ring-blue-200"
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200"
  }
};
function StatusBadge({ status, className = "" }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground ring-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${config.className} ${className}`,
      children: config.label
    }
  );
}
export {
  StatusBadge as S
};
