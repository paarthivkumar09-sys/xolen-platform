import { d as useActor, m as useQueryClient, e as useQuery, n as useMutation, j as jsxRuntimeExports, C as CreditCard, b as ue, f as createActor } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { C as Clock } from "./clock-CvKKjivn.js";
import { C as CircleCheckBig } from "./circle-check-big-BSqXwEMY.js";
import "./index-fYYCyfxq.js";
function formatDate(ns) {
  return new Date(Number(ns) / 1e6).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit"
  });
}
function MethodBadge({ method }) {
  const cfg = {
    upi: "bg-purple-50 text-purple-700",
    card: "bg-blue-50 text-blue-700",
    wallet: "bg-emerald-50 text-emerald-700"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ring-1 ring-inset ring-border ${cfg[method] ?? "bg-muted text-muted-foreground"}`,
      children: method
    }
  );
}
function AdminPayments() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["adminPayments"],
    queryFn: async () => actor ? actor.getAdminPayments() : [],
    enabled: !!actor && !isFetching
  });
  const { data: payouts, isLoading: payoutsLoading } = useQuery({
    queryKey: ["pendingPayouts"],
    queryFn: async () => actor ? actor.getPendingPayouts() : [],
    enabled: !!actor && !isFetching
  });
  const releaseMutation = useMutation({
    mutationFn: async (bookingId) => {
      if (!actor) throw new Error();
      await actor.markPayoutProcessed(bookingId);
    },
    onSuccess: () => {
      ue.success("Payout marked as processed!");
      qc.invalidateQueries({ queryKey: ["pendingPayouts"] });
    },
    onError: () => ue.error("Failed to process payout")
  });
  const unprocessed = (payouts ?? []).filter((p) => !p.processed);
  const totalRevenue = (payments ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "admin_payments.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Payments" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-4 py-2 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-emerald-600", children: [
          "₹",
          totalRevenue.toLocaleString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Total collected" })
      ] })
    ] }),
    (payoutsLoading || unprocessed.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 bg-amber-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-b border-amber-200 px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-amber-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-amber-800", children: "Pending Owner Payouts" }),
        !payoutsLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white", children: unprocessed.length })
      ] }),
      payoutsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-4", children: Array.from({ length: 2 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-amber-100", children: unprocessed.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-4 py-3",
          "data-ocid": `admin_payouts.item.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-amber-900", children: [
                "Booking #",
                String(p.bookingId)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700", children: [
                "₹",
                Number(p.amount).toLocaleString("en-IN"),
                " • Release: ",
                formatDate(p.releaseAt)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                className: "h-8 rounded-lg bg-primary text-primary-foreground text-xs",
                onClick: () => releaseMutation.mutate(p.bookingId),
                disabled: releaseMutation.isPending,
                "data-ocid": `admin_payouts.release_button.${i + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "mr-1 h-3 w-3" }),
                  " Mark Processed"
                ]
              }
            )
          ]
        },
        String(p.bookingId)
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 text-sm font-semibold flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "h-4 w-4 text-muted-foreground" }),
        "All Payments"
      ] }),
      paymentsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-lg" }, i)
      )) }) : !(payments == null ? void 0 : payments.length) ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-card py-10 text-center",
          "data-ocid": "admin_payments.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No payments recorded" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: [
          "Payment ID",
          "Booking ID",
          "Amount",
          "Method",
          "Status",
          "Date"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-muted-foreground",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border bg-card", children: payments.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `admin_payments.item.${i + 1}`,
            className: "hover:bg-muted/30 transition-smooth",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: [
                "#",
                String(p.id)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-mono text-xs", children: [
                "#",
                String(p.bookingId)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap", children: [
                "₹",
                Number(p.amount).toLocaleString("en-IN")
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MethodBadge, { method: p.paymentMethod }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: p.status }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap", children: formatDate(p.createdAt) })
            ]
          },
          String(p.id)
        )) })
      ] }) })
    ] })
  ] });
}
export {
  AdminPayments as default
};
