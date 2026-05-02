import { d as useActor, e as useQuery, z as DollarSign, A as BookOpen, B as Building2, k as Users, G as ChartColumn, j as jsxRuntimeExports, i as Link, f as createActor } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { T as TrendingUp } from "./trending-up-BhM1L2DH.js";
import { T as TriangleAlert } from "./triangle-alert-aMZ_vyq4.js";
import { A as ArrowRight } from "./arrow-right-Bmt7xBgI.js";
const EMPTY_ANALYTICS = {
  totalProperties: 0n,
  totalBookings: 0n,
  totalUsers: 0n,
  totalRevenue: 0n,
  activeStays: 0n,
  pendingVerifications: 0n,
  refundsProcessed: 0n
};
function AdminDashboard() {
  const { actor, isFetching } = useActor(createActor);
  const ready = !!actor && !isFetching;
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ["adminAnalytics"],
    queryFn: async () => actor ? actor.getAdminAnalytics() : EMPTY_ANALYTICS,
    enabled: ready
  });
  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => actor ? actor.getAdminBookings() : [],
    enabled: ready
  });
  const recentBookings = (bookings ?? []).slice(0, 5);
  const kpis = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₹${Number((analytics == null ? void 0 : analytics.totalRevenue) ?? 0n).toLocaleString("en-IN")}`,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: BookOpen,
      label: "Total Bookings",
      value: String((analytics == null ? void 0 : analytics.totalBookings) ?? 0n),
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: TrendingUp,
      label: "Active Stays",
      value: String((analytics == null ? void 0 : analytics.activeStays) ?? 0n),
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      icon: TriangleAlert,
      label: "Pending Verifications",
      value: String((analytics == null ? void 0 : analytics.pendingVerifications) ?? 0n),
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: Building2,
      label: "Properties",
      value: String((analytics == null ? void 0 : analytics.totalProperties) ?? 0n),
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      icon: Users,
      label: "Total Users",
      value: String((analytics == null ? void 0 : analytics.totalUsers) ?? 0n),
      color: "text-rose-600",
      bg: "bg-rose-50"
    }
  ];
  const quickActions = [
    {
      label: "Review Properties",
      to: "/admin/properties",
      icon: Building2,
      badge: Number((analytics == null ? void 0 : analytics.pendingVerifications) ?? 0n)
    },
    { label: "View Bookings", to: "/admin/bookings", icon: BookOpen, badge: 0 },
    { label: "Manage Users", to: "/admin/users", icon: Users, badge: 0 },
    { label: "Analytics", to: "/admin/analytics", icon: ChartColumn, badge: 0 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Dashboard" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Welcome back, admin. Here's what's happening." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-3", children: analyticsLoading ? Array.from({ length: 6 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, i)
    )) : kpis.map(({ icon: Icon, label, value, color, bg }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-4",
        "data-ocid": `admin_dashboard.kpi.${label.toLowerCase().replace(/\s+/g, "_")}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mb-2 inline-flex rounded-lg p-1.5 ${bg}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-4 w-4 ${color}` }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-display text-2xl font-bold ${color}`, children: value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: label })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between border-b border-border px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Recent Bookings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/admin/bookings",
              className: "flex items-center gap-1 text-xs text-primary hover:underline",
              "data-ocid": "admin_dashboard.view_bookings_link",
              children: [
                "View all ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
              ]
            }
          )
        ] }),
        bookingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: Array.from({ length: 4 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, i)
        )) }) : recentBookings.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "py-8 text-center text-sm text-muted-foreground",
            "data-ocid": "admin_dashboard.bookings_empty_state",
            children: "No bookings yet"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border", children: ["ID", "Property", "Days", "Amount", "Status"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "px-4 py-2 text-left text-xs font-semibold text-muted-foreground",
              children: h
            },
            h
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border", children: recentBookings.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "hover:bg-muted/30",
              "data-ocid": `admin_dashboard.booking_row.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-mono text-xs text-muted-foreground", children: [
                  "#",
                  String(b.id)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
                  "#",
                  String(b.propertyId)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5", children: [
                  Number(b.totalDays),
                  "d"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-2.5 font-semibold", children: [
                  "₹",
                  Number(b.totalPrice).toLocaleString("en-IN")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: b.paymentStatus }) })
              ]
            },
            String(b.id)
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold", children: "Quick Actions" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 p-3", children: quickActions.map(({ label, to, icon: Icon, badge }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to,
            "data-ocid": `admin_dashboard.quick_action.${label.toLowerCase().replace(/\s+/g, "_")}_link`,
            className: "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted/50 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                badge > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground", children: badge }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground" })
              ] })
            ]
          },
          to
        )) })
      ] })
    ] })
  ] });
}
export {
  AdminDashboard as default
};
