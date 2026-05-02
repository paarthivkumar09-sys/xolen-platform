import { c as createLucideIcon, e as useQuery, j as jsxRuntimeExports, z as DollarSign } from "./index-Dtbu2WTs.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { C as Clock } from "./clock-CvKKjivn.js";
import { T as TrendingUp } from "./trending-up-BhM1L2DH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
const MOCK_HISTORY = [
  {
    label: "Booking #1042 — Flat 3B, Bhubaneswar",
    amount: 4200,
    date: "Apr 28, 2026",
    status: "Paid"
  },
  {
    label: "Booking #1031 — Flat 3B, Bhubaneswar",
    amount: 8400,
    date: "Apr 13, 2026",
    status: "Paid"
  },
  {
    label: "Booking #1018 — Flat 3B, Bhubaneswar",
    amount: 6300,
    date: "Mar 30, 2026",
    status: "Paid"
  },
  {
    label: "Booking #1007 — Flat 3B, Bhubaneswar",
    amount: 2100,
    date: "Mar 15, 2026",
    status: "Paid"
  }
];
function EarningStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  highlight = false,
  loading = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-xl border p-4 shadow-sm ${highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `rounded-lg p-1.5 ${highlight ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
            }
          )
        ] }),
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-28" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: `font-display text-2xl font-bold ${highlight ? "text-primary" : "text-foreground"}`,
            children: value
          }
        ),
        subtext && !loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: subtext })
      ]
    }
  );
}
function OwnerEarningsPage() {
  const { actor, ready } = useBackend();
  const { data: earnings, isLoading } = useQuery({
    queryKey: ["owner", "earnings"],
    queryFn: async () => {
      if (!actor) throw new Error("Not ready");
      return actor.getOwnerEarnings();
    },
    enabled: ready
  });
  const totalEarned = Number((earnings == null ? void 0 : earnings.totalEarned) ?? 0);
  const pendingPayout = Number((earnings == null ? void 0 : earnings.pendingPayout) ?? 0);
  const totalBookings = Number((earnings == null ? void 0 : earnings.totalBookings) ?? 0);
  const activeBookings = Number((earnings == null ? void 0 : earnings.activeBookings) ?? 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "owner_earnings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Earnings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Track your income and payouts" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EarningStatCard,
        {
          label: "Total Earned",
          value: `₹${totalEarned.toLocaleString("en-IN")}`,
          icon: DollarSign,
          highlight: true,
          loading: isLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EarningStatCard,
        {
          label: "Pending Payout",
          value: `₹${pendingPayout.toLocaleString("en-IN")}`,
          subtext: "Held for 24h",
          icon: Clock,
          loading: isLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EarningStatCard,
        {
          label: "Total Bookings",
          value: String(totalBookings),
          icon: TrendingUp,
          loading: isLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        EarningStatCard,
        {
          label: "Active Stays",
          value: String(activeBookings),
          icon: ArrowDownLeft,
          loading: isLoading
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-200 bg-amber-50 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-amber-800", children: "Payout Schedule" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-amber-700 leading-relaxed", children: [
          "Earnings are held for ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "24 hours" }),
          " after booking confirmation, then automatically released to your registered bank account or UPI. This hold ensures the customer decision window (visit + accept/refund) has passed."
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display font-semibold text-foreground", children: "Earnings History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: MOCK_HISTORY.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between rounded-lg bg-muted/30 p-3",
          "data-ocid": `owner_earnings.history_item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium text-foreground", children: entry.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: entry.date })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-3 flex flex-col items-end", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm text-primary", children: [
                "+₹",
                entry.amount.toLocaleString("en-IN")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-emerald-600 font-medium", children: entry.status })
            ] })
          ]
        },
        entry.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-center text-xs text-muted-foreground", children: "Showing recent 4 transactions" })
    ] })
  ] });
}
export {
  OwnerEarningsPage as default
};
