import { c as createLucideIcon, g as useSearch, a as useNavigate, r as reactExports, s as PaymentMethod, e as useQuery, n as useMutation, j as jsxRuntimeExports, h as PropertyStatus, C as CreditCard, L as LoaderCircle, b as ue } from "./index-Dtbu2WTs.js";
import { X as XolenBadge } from "./XolenBadge-ehPo_3Fe.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { C as ChevronLeft } from "./chevron-left-Cjlzc0e2.js";
import { C as CircleCheckBig } from "./circle-check-big-BSqXwEMY.js";
import { C as CalendarDays } from "./calendar-days-D7gsFtTl.js";
import { C as ChevronRight } from "./chevron-right-CuGYFeKb.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
];
const Smartphone = createLucideIcon("smartphone", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
      key: "18etb6"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4", key: "xoc0q4" }]
];
const Wallet = createLucideIcon("wallet", __iconNode);
const ADDONS = [
  {
    id: "ac",
    name: "AC Cleaning",
    description: "Deep clean your AC unit",
    price: 500,
    icon: "❄️"
  },
  {
    id: "home",
    name: "Home Cleaning",
    description: "Full home deep clean",
    price: 800,
    icon: "🧹"
  },
  {
    id: "setup",
    name: "Setup Kit",
    description: "Essentials kit for move-in",
    price: 1500,
    icon: "📦"
  }
];
const MIN_DAYS = 15;
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}
function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
function fmt(n) {
  return `₹${n.toLocaleString("en-IN")}`;
}
const STEPS = ["Dates", "Add-ons", "Review", "Payment"];
function Checkout() {
  var _a;
  const search = useSearch({ strict: false });
  const propertyId = search.propertyId ?? "";
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const [step, setStep] = reactExports.useState(0);
  const [checkIn, setCheckIn] = reactExports.useState(() => addDays(/* @__PURE__ */ new Date(), 1));
  const [totalDays, setTotalDays] = reactExports.useState(MIN_DAYS);
  const [selectedAddons, setSelectedAddons] = reactExports.useState(/* @__PURE__ */ new Set());
  const [paymentMethod, setPaymentMethod] = reactExports.useState(
    PaymentMethod.upi
  );
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(BigInt(propertyId));
    },
    enabled: ready && !!propertyId
  });
  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: ready
  });
  const addonServiceMap = {};
  if (services) {
    for (const svc of services) {
      if (svc.name.toLowerCase().includes("ac")) addonServiceMap.ac = svc.id;
      else if (svc.name.toLowerCase().includes("home"))
        addonServiceMap.home = svc.id;
      else if (svc.name.toLowerCase().includes("setup"))
        addonServiceMap.setup = svc.id;
    }
  }
  const checkOut = addDays(checkIn, totalDays);
  const perDay = property ? Number(property.perDayPrice) : 0;
  const roomCost = perDay * totalDays;
  const addonTotal = ADDONS.filter((a) => selectedAddons.has(a.id)).reduce(
    (s, a) => s + a.price,
    0
  );
  const total = roomCost + addonTotal;
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !property) throw new Error("Not ready");
      const checkInNs = BigInt(checkIn.getTime()) * 1000000n;
      const addonIds = ADDONS.filter((a) => selectedAddons.has(a.id)).map((a) => addonServiceMap[a.id]).filter((id) => id !== void 0);
      const booking = await actor.createBooking({
        propertyId: property.id,
        checkIn: checkInNs,
        totalDays: BigInt(totalDays),
        serviceAddonIds: addonIds
      });
      await actor.createPayment({
        bookingId: booking.id,
        amount: BigInt(total),
        paymentMethod
      });
      return booking;
    },
    onSuccess: (booking) => {
      ue.success("Payment successful! Booking confirmed.");
      navigate({ to: "/booking/$id", params: { id: String(booking.id) } });
    },
    onError: () => {
      ue.error("Payment failed. Please try again.");
    }
  });
  if (!propertyId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-20",
        "data-ocid": "checkout.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No property selected." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => navigate({ to: "/" }),
              className: "text-primary underline",
              children: "Back to Home"
            }
          )
        ]
      }
    );
  }
  if (isLoading || !ready) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "checkout.loading_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" })
    ] });
  }
  if (!property) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center", "data-ocid": "checkout.error_state", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Property not found." }) });
  }
  const isVerified = property.status === PropertyStatus.verified;
  const todayStr = addDays(/* @__PURE__ */ new Date(), 1).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-6", "data-ocid": "checkout.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": "checkout.back_button",
          onClick: () => step > 0 ? setStep(step - 1) : navigate({ to: "/property/$id", params: { id: propertyId } }),
          className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/70",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-lg font-bold text-foreground", children: "Checkout" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6 flex items-center gap-1", "data-ocid": "checkout.steps", children: STEPS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-smooth ${i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`,
          children: i < step ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-4 w-4" }) : i + 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `text-[10px] font-medium ${i <= step ? "text-primary" : "text-muted-foreground"}`,
          children: label
        }
      )
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: ((_a = property.photos[0]) == null ? void 0 : _a.getDirectURL()) ?? "/assets/images/placeholder.svg",
          alt: property.location.address,
          className: "h-14 w-14 rounded-lg object-cover",
          onError: (e) => {
            e.target.src = "/assets/images/placeholder.svg";
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-sm font-semibold text-foreground", children: property.location.address }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: property.location.city }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 font-bold text-primary", children: [
          "\\u20b9",
          Number(property.perDayPrice).toLocaleString("en-IN"),
          "/day"
        ] })
      ] }),
      isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(XolenBadge, {})
    ] }),
    step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "checkout.dates_step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Select Dates" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
              htmlFor: "checkin-date",
              children: "Check-in Date"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "checkin-date",
              type: "date",
              "data-ocid": "checkout.checkin_input",
              min: todayStr,
              value: checkIn.toISOString().split("T")[0],
              onChange: (e) => setCheckIn(new Date(e.target.value)),
              className: "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "mb-1.5 block text-xs font-semibold text-muted-foreground",
              htmlFor: "total-days",
              children: [
                "Duration (minimum ",
                MIN_DAYS,
                " days)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "checkout.days_decrease_button",
                onClick: () => setTotalDays((d) => Math.max(MIN_DAYS, d - 1)),
                className: "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted font-bold text-foreground transition-smooth hover:bg-muted/70",
                children: "\\u2013"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "flex-1 text-center font-display text-lg font-bold text-foreground",
                "data-ocid": "checkout.days_count",
                children: [
                  totalDays,
                  " days"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "checkout.days_increase_button",
                onClick: () => setTotalDays((d) => d + 1),
                className: "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted font-bold text-foreground transition-smooth hover:bg-muted/70",
                children: "+"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Check-in:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatDate(checkIn) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-4 w-4 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Check-out:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatDate(checkOut) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "checkout.next_button",
          className: "w-full rounded-xl py-5 font-display font-bold",
          onClick: () => setStep(1),
          children: [
            "Continue ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
          ]
        }
      )
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "checkout.addons_step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Add-on Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Make your stay even better" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ADDONS.map((addon) => {
        const selected = selectedAddons.has(addon.id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `checkout.addon_${addon.id}_toggle`,
            onClick: () => {
              const next = new Set(selectedAddons);
              if (selected) next.delete(addon.id);
              else next.add(addon.id);
              setSelectedAddons(next);
            },
            className: `flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-smooth ${selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: addon.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: addon.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: addon.description })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-sm text-primary", children: [
                  "+",
                  fmt(addon.price)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `mt-1 h-5 w-5 rounded-full border-2 ml-auto flex items-center justify-center transition-smooth ${selected ? "border-primary bg-primary" : "border-border"}`,
                    children: selected && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-primary-foreground" })
                  }
                )
              ] })
            ]
          },
          addon.id
        );
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "checkout.next_button",
          className: "w-full rounded-xl py-5 font-display font-bold",
          onClick: () => setStep(2),
          children: [
            "Continue ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
          ]
        }
      )
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "checkout.review_step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Price Breakdown" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            fmt(perDay),
            " \\u00d7 ",
            totalDays,
            " days"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: fmt(roomCost) })
        ] }),
        ADDONS.filter((a) => selectedAddons.has(a.id)).map((addon) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
            addon.icon,
            " ",
            addon.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            "+",
            fmt(addon.price)
          ] })
        ] }, addon.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-3 flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: "Total" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-xl font-bold text-primary", children: fmt(total) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-muted/40 p-3 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Check-in:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatDate(checkIn) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Check-out:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: formatDate(checkOut) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Duration:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
            totalDays,
            " days"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "checkout.next_button",
          className: "w-full rounded-xl py-5 font-display font-bold",
          onClick: () => setStep(3),
          children: [
            "Proceed to Payment ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "ml-1 h-4 w-4" })
          ]
        }
      )
    ] }),
    step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", "data-ocid": "checkout.payment_step", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground", children: "Payment" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [
        {
          method: PaymentMethod.upi,
          label: "UPI",
          desc: "Pay with any UPI app",
          icon: Smartphone
        },
        {
          method: PaymentMethod.card,
          label: "Card",
          desc: "Debit or Credit card",
          icon: CreditCard
        },
        {
          method: PaymentMethod.wallet,
          label: "Wallet",
          desc: "Digital wallet",
          icon: Wallet
        }
      ].map(({ method, label, desc, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": `checkout.payment_${method}_select`,
          onClick: () => setPaymentMethod(method),
          className: `flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-smooth ${paymentMethod === method ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-10 w-10 items-center justify-center rounded-full ${paymentMethod === method ? "bg-primary" : "bg-muted"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    className: `h-5 w-5 ${paymentMethod === method ? "text-primary-foreground" : "text-muted-foreground"}`
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: desc })
            ] }),
            paymentMethod === method && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-5 w-5 text-primary" })
          ]
        },
        method
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-foreground", children: "Total to Pay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-2xl font-bold text-primary", children: fmt(total) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          "data-ocid": "checkout.pay_button",
          className: "w-full rounded-xl py-5 font-display text-base font-bold",
          disabled: bookMutation.isPending,
          onClick: () => bookMutation.mutate(),
          children: bookMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Processing..."
          ] }) : `Pay ${fmt(total)}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
        "Not satisfied? Get",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "90% refund" }),
        " ",
        "within 30 min of visit"
      ] })
    ] })
  ] });
}
export {
  Checkout as default
};
