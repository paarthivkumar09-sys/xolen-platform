import { d as useActor, r as reactExports, e as useQuery, j as jsxRuntimeExports, S as Search, f as createActor } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "refunded", label: "Refunded" },
  { key: "completed", label: "Completed" }
];
function formatDate(ns) {
  return new Date(Number(ns) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit"
  });
}
function AdminBookings() {
  const { actor, isFetching } = useActor(createActor);
  const [tab, setTab] = reactExports.useState("all");
  const [search, setSearch] = reactExports.useState("");
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => actor ? actor.getAdminBookings() : [],
    enabled: !!actor && !isFetching
  });
  const filtered = reactExports.useMemo(() => {
    let list = bookings ?? [];
    if (tab === "active")
      list = list.filter(
        (b) => b.paymentStatus === "success" && b.decisionStatus === "pending"
      );
    else if (tab === "refunded")
      list = list.filter((b) => b.decisionStatus === "refunded");
    else if (tab === "completed")
      list = list.filter((b) => b.decisionStatus === "accepted");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) => String(b.id).includes(q) || b.customerId.toString().toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, tab, search]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "admin_bookings.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "All Bookings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 rounded-lg border border-border bg-muted/40 p-1", children: TABS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `admin_bookings.${key}_tab`,
          onClick: () => setTab(key),
          className: `rounded-md px-3 py-1 text-xs font-medium transition-smooth ${tab === key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
          children: label
        },
        key
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xs w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search by ID or customer…",
            className: "pl-8 h-8 text-sm",
            "data-ocid": "admin_bookings.search_input"
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 5 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)
    )) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card py-12 text-center text-muted-foreground",
        "data-ocid": "admin_bookings.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mx-auto mb-2 h-8 w-8 opacity-30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No bookings found" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
        "Booking ID",
        "Customer",
        "Property",
        "Check-in",
        "Check-out",
        "Amount",
        "Decision",
        "Payment"
      ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "th",
        {
          className: "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
          children: h
        },
        h
      )) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border bg-card", children: filtered.map((b, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          "data-ocid": `admin_bookings.item.${i + 1}`,
          className: "hover:bg-muted/30 transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
              "#",
              String(b.id)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 max-w-[120px] truncate text-xs", children: [
              b.customerId.toString().slice(0, 12),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
              "#",
              String(b.propertyId)
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs whitespace-nowrap", children: formatDate(b.checkIn) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs whitespace-nowrap", children: formatDate(b.checkOut) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-semibold whitespace-nowrap", children: [
              "₹",
              Number(b.totalPrice).toLocaleString("en-IN")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: b.decisionStatus }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: b.paymentStatus }) })
          ]
        },
        String(b.id)
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Showing ",
      filtered.length,
      " of ",
      (bookings == null ? void 0 : bookings.length) ?? 0,
      " bookings"
    ] })
  ] });
}
export {
  AdminBookings as default
};
