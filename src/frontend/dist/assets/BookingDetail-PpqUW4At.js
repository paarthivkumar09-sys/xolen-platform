import { c as createLucideIcon, l as useParams, a as useNavigate, m as useQueryClient, e as useQuery, n as useMutation, D as DecisionStatus, j as jsxRuntimeExports, h as PropertyStatus, o as PaymentStatus, r as reactExports, b as ue } from "./index-Dtbu2WTs.js";
import { X as XolenBadge } from "./XolenBadge-ehPo_3Fe.js";
import { B as Badge } from "./badge-BY7OGQ7n.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { C as ChevronLeft } from "./chevron-left-Cjlzc0e2.js";
import { C as CircleCheck } from "./circle-check-B7IaRigW.js";
import { R as RefreshCcw } from "./refresh-ccw-B7jBZzVr.js";
import { C as Clock } from "./clock-CvKKjivn.js";
import { M as MapPin } from "./map-pin-CehLSmlL.js";
import { C as CalendarDays } from "./calendar-days-D7gsFtTl.js";
import { T as ThumbsUp } from "./thumbs-up-BOHfu_6A.js";
import "./circle-check-big-BSqXwEMY.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M17 14V2", key: "8ymqnk" }],
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
      key: "m61m77"
    }
  ]
];
const ThumbsDown = createLucideIcon("thumbs-down", __iconNode);
function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
function formatDate(ns) {
  return new Date(Number(ns) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function useCountdown(deadlineNs) {
  const [remaining, setRemaining] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!deadlineNs) return;
    const tick = () => {
      const nowMs = Date.now();
      const deadlineMs = Number(deadlineNs) / 1e6;
      const diff = deadlineMs - nowMs;
      if (diff <= 0) {
        setRemaining("00:00");
        return;
      }
      const mins = Math.floor(diff / 6e4);
      const secs = Math.floor(diff % 6e4 / 1e3);
      setRemaining(
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    };
    tick();
    const interval = setInterval(tick, 1e3);
    return () => clearInterval(interval);
  }, [deadlineNs]);
  return remaining;
}
function BookingDetail() {
  var _a;
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const queryClient = useQueryClient();
  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBooking(BigInt(id));
    },
    enabled: ready && !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.decisionStatus === DecisionStatus.pending) return 1e4;
      return false;
    }
  });
  const { data: property, isLoading: propLoading } = useQuery({
    queryKey: ["property", booking ? String(booking.propertyId) : ""],
    queryFn: async () => {
      if (!actor || !booking) return null;
      return actor.getProperty(booking.propertyId);
    },
    enabled: ready && !!booking
  });
  const decisionMutation = useMutation({
    mutationFn: async (decision) => {
      if (!actor || !booking) throw new Error("Not ready");
      return actor.processDecision(booking.id, decision);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["booking", id], updated);
      if (updated.decisionStatus === DecisionStatus.accepted) {
        ue.success("Stay confirmed! Welcome home. 🏠");
      } else if (updated.decisionStatus === DecisionStatus.refunded) {
        ue.success("90% refund initiated. It will reflect shortly.");
      }
    },
    onError: () => {
      ue.error("Failed to process decision. Please try again.");
    }
  });
  const countdown = useCountdown(
    (booking == null ? void 0 : booking.decisionStatus) === DecisionStatus.pending ? booking.decisionDeadline : void 0
  );
  const isLoading = bookingLoading || propLoading || !ready;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "booking_detail.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-28 w-full rounded-xl" })
    ] });
  }
  if (!booking) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-20",
        "data-ocid": "booking_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: "Booking not found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/my-bookings" }),
              className: "text-primary underline",
              children: "My Bookings"
            }
          )
        ]
      }
    );
  }
  const isPending = booking.decisionStatus === DecisionStatus.pending;
  const isAccepted = booking.decisionStatus === DecisionStatus.accepted;
  const isRefunded = booking.decisionStatus === DecisionStatus.refunded;
  const isExpired = booking.decisionStatus === DecisionStatus.expired;
  const deadlineMs = Number(booking.decisionDeadline) / 1e6;
  const withinDeadline = isPending && Date.now() < deadlineMs;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-8", "data-ocid": "booking_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "booking_detail.back_button",
          onClick: () => navigate({ to: "/my-bookings" }),
          className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/70",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground", children: "Booking Details" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "booking_detail.status_banner", children: [
      isAccepted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-5 w-5 shrink-0 text-emerald-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-emerald-800", children: "Your stay is confirmed! \\ud83c\\udfe0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-700", children: "Enjoy your stay. Contact support if you need help." })
        ] })
      ] }),
      isRefunded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "mt-0.5 h-5 w-5 shrink-0 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "90% refund processed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Refund will reflect in 2\\u20135 business days." })
        ] })
      ] }),
      isExpired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Decision time expired" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No refund available after the decision window." })
        ] })
      ] })
    ] }),
    property && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: ((_a = property.photos[0]) == null ? void 0 : _a.getDirectURL()) ?? "/assets/images/placeholder.svg",
          alt: property.location.address,
          className: "h-16 w-16 rounded-lg object-cover",
          onError: (e) => {
            e.target.src = "/assets/images/placeholder.svg";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground truncate", children: property.location.address }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: property.location.city })
        ] }),
        property.status === PropertyStatus.verified && /* @__PURE__ */ jsxRuntimeExports.jsx(XolenBadge, { className: "mt-1.5" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground", children: "Booking Info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
            " Check-in"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: formatDate(booking.checkIn) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
            " Check-out"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: formatDate(booking.checkOut) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Duration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
          Number(booking.totalDays),
          " days"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Total Paid" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-primary", children: fmt(booking.totalPrice) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: booking.paymentStatus === PaymentStatus.success ? "default" : "secondary",
            className: booking.paymentStatus === PaymentStatus.success ? "bg-emerald-100 text-emerald-800 border-emerald-200" : "",
            children: booking.paymentStatus
          }
        )
      ] }),
      booking.serviceAddons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-1", children: "Add-on Services" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: booking.serviceAddons.map((addon) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "text-xs",
            children: addon.serviceName
          },
          String(addon.serviceId)
        )) })
      ] })
    ] }),
    isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border-2 border-primary bg-card p-4 space-y-4",
        "data-ocid": "booking_detail.decision_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground", children: "Make Your Decision" }),
            withinDeadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "font-mono text-sm font-bold text-primary",
                  "data-ocid": "booking_detail.countdown",
                  children: countdown
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Visit the property and decide within 30 minutes of arrival." }),
          withinDeadline ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "booking_detail.continue_stay_button",
                className: "w-full rounded-xl py-5 font-display font-bold bg-emerald-600 hover:bg-emerald-700 text-white",
                disabled: decisionMutation.isPending,
                onClick: () => decisionMutation.mutate(DecisionStatus.accepted),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "mr-2 h-5 w-5" }),
                  "I'm Happy \\u2014 Continue Stay"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                variant: "outline",
                "data-ocid": "booking_detail.refund_button",
                className: "w-full rounded-xl py-5 font-display font-bold border-primary text-primary hover:bg-primary/5",
                disabled: decisionMutation.isPending,
                onClick: () => decisionMutation.mutate(DecisionStatus.refunded),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsDown, { className: "mr-2 h-5 w-5" }),
                  "Not Satisfied \\u2014 Get Refund"
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/40 p-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Decision time has passed. No refund available." }) })
        ]
      }
    ),
    isAccepted && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-muted/30 p-4 text-center",
        "data-ocid": "booking_detail.extend_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "Want to extend your stay?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              "data-ocid": "booking_detail.extend_button",
              className: "rounded-xl border-secondary text-secondary hover:bg-secondary/5",
              onClick: () => navigate({
                to: "/checkout",
                search: { propertyId: String(booking.propertyId) }
              }),
              children: "Extend Stay"
            }
          )
        ]
      }
    )
  ] });
}
export {
  BookingDetail as default
};
