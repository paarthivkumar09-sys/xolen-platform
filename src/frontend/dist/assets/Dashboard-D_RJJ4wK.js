import { e as useQuery, h as PropertyStatus, j as jsxRuntimeExports, i as Link, B as Building2, k as Users, z as DollarSign } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { X as XolenBadge } from "./XolenBadge-ehPo_3Fe.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { P as Plus } from "./plus-DW8p3b6a.js";
import { T as TrendingUp } from "./trending-up-BhM1L2DH.js";
import "./circle-check-big-BSqXwEMY.js";
import "./index-fYYCyfxq.js";
function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
  loading = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `rounded-lg bg-muted p-1.5 ${color}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: value })
  ] });
}
function PropertyRow({ property }) {
  const isVerified = property.status === PropertyStatus.verified;
  const typeLabel = {
    oneRK: "1RK",
    oneBHK: "1BHK",
    twoBHK: "2BHK",
    threeBHK: "3BHK",
    room: "Room"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-sm font-semibold text-foreground", children: [
        typeLabel[property.propertyType] ?? property.propertyType,
        " —",
        " ",
        property.location.city
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "₹",
        Number(property.monthlyRent).toLocaleString("en-IN"),
        "/month"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: property.status }),
      isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(XolenBadge, { size: "sm" })
    ] })
  ] });
}
function OwnerDashboard() {
  const { actor, ready } = useBackend();
  const { data: earnings, isLoading: earningsLoading } = useQuery({
    queryKey: ["owner", "earnings"],
    queryFn: async () => {
      if (!actor) throw new Error("Not ready");
      return actor.getOwnerEarnings();
    },
    enabled: ready
  });
  const { data: properties = [], isLoading: propsLoading } = useQuery({
    queryKey: ["owner", "properties"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(null);
    },
    enabled: ready
  });
  const pendingCount = properties.filter(
    (p) => p.status === PropertyStatus.pending
  ).length;
  const verifiedCount = properties.filter(
    (p) => p.status === PropertyStatus.verified
  ).length;
  const previewProps = properties.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "owner_dashboard.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Welcome back! 👋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage your properties and track earnings" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/owner/property/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          "data-ocid": "owner_dashboard.add_property_button",
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add Property"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Properties",
          value: propsLoading ? "—" : properties.length,
          icon: Building2,
          loading: propsLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Pending Verification",
          value: propsLoading ? "—" : pendingCount,
          icon: TrendingUp,
          color: "text-amber-600",
          loading: propsLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Bookings",
          value: earningsLoading ? "—" : Number((earnings == null ? void 0 : earnings.activeBookings) ?? 0),
          icon: Users,
          color: "text-secondary",
          loading: earningsLoading
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Earned",
          value: earningsLoading ? "—" : `₹${Number((earnings == null ? void 0 : earnings.totalEarned) ?? 0).toLocaleString("en-IN")}`,
          icon: DollarSign,
          color: "text-primary",
          loading: earningsLoading
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "My Properties" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/owner/properties",
            "data-ocid": "owner_dashboard.view_all_link",
            className: "text-xs font-medium text-primary hover:underline",
            children: "View all →"
          }
        )
      ] }),
      propsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full rounded-lg" }, i)) }) : previewProps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3 py-8 text-center",
          "data-ocid": "owner_dashboard.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-10 w-10 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No properties yet." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/owner/property/new", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                "data-ocid": "owner_dashboard.add_first_property_button",
                children: "Add your first property"
              }
            ) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        previewProps.map((property, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            "data-ocid": `owner_dashboard.property_item.${i + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyRow, { property })
          },
          String(property.id)
        )),
        properties.length > 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "pt-1 text-center text-xs text-muted-foreground", children: [
          "+",
          properties.length - 3,
          " more •",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/owner/properties",
              className: "text-primary hover:underline",
              children: "View all"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display font-semibold text-foreground", children: "Quick Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            verifiedCount,
            " Verified"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-amber-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            pendingCount,
            " Pending review"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-secondary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            Number((earnings == null ? void 0 : earnings.activeBookings) ?? 0),
            " Active stays"
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  OwnerDashboard as default
};
