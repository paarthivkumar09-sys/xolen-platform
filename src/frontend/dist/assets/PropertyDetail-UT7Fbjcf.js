import { c as createLucideIcon, j as jsxRuntimeExports, l as useParams, a as useNavigate, r as reactExports, e as useQuery, h as PropertyStatus, k as Users, P as PropertyType, T as TenantType, F as FurnishingType } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { A as ArrowRight } from "./arrow-right-Bmt7xBgI.js";
import { X as XolenBadge } from "./XolenBadge-ehPo_3Fe.js";
import { B as Badge } from "./badge-BY7OGQ7n.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { C as ChevronLeft } from "./chevron-left-Cjlzc0e2.js";
import { C as ChevronRight } from "./chevron-right-CuGYFeKb.js";
import { M as MapPin } from "./map-pin-CehLSmlL.js";
import { S as Shield } from "./shield-CPLmzQpv.js";
import { Z as Zap } from "./zap-Dc9fS8p-.js";
import "./index-fYYCyfxq.js";
import "./circle-check-big-BSqXwEMY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10 4 8 6", key: "1rru8s" }],
  ["path", { d: "M17 19v2", key: "ts1sot" }],
  ["path", { d: "M2 12h20", key: "9i4pu4" }],
  ["path", { d: "M7 19v2", key: "12npes" }],
  [
    "path",
    {
      d: "M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5",
      key: "14ym8i"
    }
  ]
];
const Bath = createLucideIcon("bath", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8", key: "1k78r4" }],
  ["path", { d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4", key: "fb3tl2" }],
  ["path", { d: "M12 4v6", key: "1dcgq2" }],
  ["path", { d: "M2 18h20", key: "ajqnye" }]
];
const BedDouble = createLucideIcon("bed-double", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
function StickyBookButton({
  label = "Book Now",
  onClick,
  disabled = false,
  isLoading = false,
  price
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "button-sticky-mobile", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-lg", children: [
    price && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-center text-sm text-muted-foreground", children: [
      "Total: ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: price })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        "data-ocid": "property.book_now.primary_button",
        onClick,
        disabled: disabled || isLoading,
        className: "w-full rounded-xl bg-primary py-6 font-display text-base font-bold text-primary-foreground shadow-lg transition-smooth hover:bg-primary/90 active:scale-95",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" }),
          "Processing..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-center text-xs text-muted-foreground", children: [
      "Not satisfied? Get",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-primary", children: "90% refund" }),
      " ",
      "instantly"
    ] })
  ] }) });
}
function fmt(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}
const TYPE_LABELS = {
  [PropertyType.oneRK]: "1 RK",
  [PropertyType.oneBHK]: "1 BHK",
  [PropertyType.twoBHK]: "2 BHK",
  [PropertyType.threeBHK]: "3 BHK",
  [PropertyType.room]: "Room"
};
const TENANT_LABELS = {
  [TenantType.boys]: "Boys Only",
  [TenantType.girls]: "Girls Only",
  [TenantType.family]: "Family",
  [TenantType.all]: "All Welcome"
};
const FURNISH_LABELS = {
  [FurnishingType.furnished]: "Fully Furnished",
  [FurnishingType.semiFurnished]: "Semi-Furnished",
  [FurnishingType.unfurnished]: "Unfurnished"
};
const AMENITY_ICONS = {
  WiFi: Wifi,
  AC: Zap,
  Bathroom: Bath
};
function PropertyDetail() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const [imgIndex, setImgIndex] = reactExports.useState(0);
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(BigInt(id));
    },
    enabled: ready && !!id
  });
  const { data: availability } = useQuery({
    queryKey: ["availability", id],
    queryFn: async () => {
      if (!actor || !property) return null;
      const today = BigInt(Date.now()) * 1000000n;
      return actor.getPropertyAvailability(BigInt(id), today, 15n);
    },
    enabled: ready && !!property
  });
  const handleBookNow = () => {
    navigate({ to: "/checkout", search: { propertyId: id } });
  };
  if (isLoading || !ready) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "space-y-4 pb-32",
        "data-ocid": "property_detail.loading_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-3/4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-1/2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-xl" })
        ]
      }
    );
  }
  if (!property) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center gap-4 py-20",
        "data-ocid": "property_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-foreground", children: "Property not found" }),
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
  const photos = property.photos.map((p) => p.getDirectURL());
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos ? photos[imgIndex] : "/assets/images/placeholder.svg";
  const isVerified = property.status === PropertyStatus.verified;
  const roomsLeft = Number(property.roomsAvailable);
  const showUrgency = roomsLeft > 0 && roomsLeft <= 3;
  const availableFrom = (availability == null ? void 0 : availability.nextAvailableFrom) ? new Date(
    Number(availability.nextAvailableFrom) / 1e6
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-36", "data-ocid": "property_detail.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "property_detail.back_button",
        onClick: () => navigate({ to: "/" }),
        className: "mb-3 flex items-center gap-1 text-sm text-muted-foreground transition-smooth hover:text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" }),
          "Back"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative overflow-hidden rounded-xl",
        "data-ocid": "property_detail.gallery",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: currentPhoto,
              alt: property.location.address,
              className: "h-64 w-full object-cover",
              onError: (e) => {
                e.target.src = "/assets/images/placeholder.svg";
              }
            }
          ),
          showUrgency && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge-urgency absolute left-3 top-3", children: [
            "Only ",
            roomsLeft,
            " room",
            roomsLeft > 1 ? "s" : "",
            " left"
          ] }),
          photos.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "property_detail.gallery_prev",
                onClick: () => setImgIndex((i) => (i - 1 + photos.length) % photos.length),
                className: "absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow transition-smooth hover:bg-card",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": "property_detail.gallery_next",
                onClick: () => setImgIndex((i) => (i + 1) % photos.length),
                className: "absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow transition-smooth hover:bg-card",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1", children: photos.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `property_detail.gallery_dot.${i + 1}`,
                onClick: () => setImgIndex(i),
                className: `h-1.5 rounded-full transition-smooth ${i === imgIndex ? "w-4 bg-primary" : "w-1.5 bg-card/70"}`
              },
              i
            )) })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground leading-tight min-w-0", children: property.location.address }),
        isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(XolenBadge, { size: "md" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: property.location.city })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "rounded-full", children: TYPE_LABELS[property.propertyType] ?? property.propertyType }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-full", children: TENANT_LABELS[property.tenantType] ?? property.tenantType }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "rounded-full", children: FURNISH_LABELS[property.furnishingType] ?? property.furnishingType })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-card p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-3xl font-bold text-primary", children: fmt(property.perDayPrice) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-sm text-muted-foreground", children: "/day" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Monthly rent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: fmt(property.monthlyRent) })
        ] })
      ] }),
      availability && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-lg bg-muted/40 px-3 py-2 text-sm", children: availability.available ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-emerald-700", children: "\\u2713 Available now" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        "Next available from",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: availableFrom ?? "—" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mt-0.5 h-5 w-5 shrink-0 text-emerald-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-emerald-800", children: "Not satisfied? Get 90% refund" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-700", children: "Visit the property after booking. Decide within 30 minutes. If not happy, get 90% back instantly." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mx-auto mb-1 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Max Guests" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold text-foreground", children: Number(property.maxGuests) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-3 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BedDouble, { className: "mx-auto mb-1 h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Rooms Available" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold text-foreground", children: [
          Number(property.roomsAvailable),
          "/",
          Number(property.totalRooms)
        ] })
      ] })
    ] }),
    property.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 font-display text-base font-semibold text-foreground", children: "About this place" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed text-muted-foreground", children: property.description })
    ] }),
    property.amenities.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-base font-semibold text-foreground", children: "Amenities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-2 gap-2",
          "data-ocid": "property_detail.amenities",
          children: property.amenities.map((amenity) => {
            const Icon = AMENITY_ICONS[amenity] ?? Zap;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }),
                  amenity
                ]
              },
              amenity
            );
          })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-border bg-muted/30 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-2 font-display text-base font-semibold text-foreground", children: "House Rules" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1 text-sm text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "\\u2022 Suitable for:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: TENANT_LABELS[property.tenantType] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "\\u2022 Furnishing:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: FURNISH_LABELS[property.furnishingType] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
          "\\u2022 Minimum stay:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "15 days" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "\\u2022 Advance payment required" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      StickyBookButton,
      {
        label: "Book Now",
        onClick: handleBookNow,
        price: `${fmt(property.perDayPrice)}/day`
      }
    )
  ] });
}
export {
  PropertyDetail as default
};
