import { c as createLucideIcon, j as jsxRuntimeExports, x as Bell, p as cn, N as NotificationType, C as CreditCard, y as useNotifications } from "./index-Dtbu2WTs.js";
import { R as RefreshCw } from "./refresh-cw-BpInm9Ln.js";
import { F as FileText } from "./file-text-2x1X94gD.js";
import { C as CircleCheckBig } from "./circle-check-big-BSqXwEMY.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode);
const typeIcons = {
  [NotificationType.bookingConfirmed]: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4 text-emerald-600" }),
  [NotificationType.paymentSuccess]: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-blue-600" }),
  [NotificationType.visitReminder]: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-amber-600" }),
  [NotificationType.extendReminder]: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-primary" }),
  [NotificationType.docUploaded]: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-purple-600" }),
  [NotificationType.refundProcessed]: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-emerald-600" })
};
function timeAgo(ts) {
  const ms = Date.now() - Number(ts) / 1e6;
  const mins = Math.floor(ms / 6e4);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}
function NotificationItem({
  notification,
  onMarkRead,
  index = 0
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `notification.item.${index + 1}`,
      onClick: () => !notification.read && (onMarkRead == null ? void 0 : onMarkRead(notification.id)),
      className: cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-smooth hover:bg-muted/60",
        !notification.read && "bg-primary/5"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted", children: typeIcons[notification.notificationType] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "text-sm text-foreground",
                !notification.read && "font-semibold"
              ),
              children: notification.message
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground", children: timeAgo(notification.createdAt) })
        ] }),
        !notification.read && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" })
      ]
    }
  );
}
function NotificationSkeletonItem() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/4" })
    ] })
  ] });
}
function Notifications() {
  const { notifications, isLoading, unreadCount, markRead } = useNotifications();
  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read);
    await Promise.allSettled(unread.map((n) => markRead(n.id)));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Notifications" }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground", children: unreadCount > 99 ? "99+" : unreadCount })
      ] }),
      unreadCount > 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "notifications.mark_all_read_button",
          variant: "ghost",
          size: "sm",
          onClick: markAllRead,
          className: "h-8 gap-1.5 text-xs text-primary hover:text-primary/80",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3.5 w-3.5" }),
            "Mark all read"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "rounded-xl border border-border bg-card divide-y divide-border",
        "data-ocid": "notifications.loading_state",
        children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(NotificationSkeletonItem, {}, i))
      }
    ) : notifications.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center py-20 text-center",
        "data-ocid": "notifications.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-8 w-8 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "No notifications yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "We'll notify you about bookings, payments, and updates" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "overflow-hidden rounded-xl border border-border bg-card divide-y divide-border",
        "data-ocid": "notifications.list",
        children: notifications.map((n, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 py-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          NotificationItem,
          {
            notification: n,
            onMarkRead: markRead,
            index: i
          }
        ) }, String(n.id)))
      }
    )
  ] });
}
export {
  Notifications as default
};
