import { c as createLucideIcon, a as useNavigate, r as reactExports, j as jsxRuntimeExports, S as Search, d as useActor, e as useQuery, f as createActor } from "./index-Dtbu2WTs.js";
import { m as motion, P as PropertyCard } from "./proxy-CtJNT4ra.js";
import { S as SkeletonCard } from "./SkeletonCard-5UjpY3_A.js";
import { X as XolenBadge } from "./XolenBadge-ehPo_3Fe.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { M as MapPin } from "./map-pin-CehLSmlL.js";
import { C as CircleCheck } from "./circle-check-B7IaRigW.js";
import { R as RefreshCw } from "./refresh-cw-BpInm9Ln.js";
import { T as ThumbsUp } from "./thumbs-up-BOHfu_6A.js";
import { A as ArrowRight } from "./arrow-right-Bmt7xBgI.js";
import { S as Star } from "./star-BYQLLgFL.js";
import "./skeleton-BQPfBTkU.js";
import "./circle-check-big-BSqXwEMY.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12", key: "bvdh0s" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12", key: "1tbv5k" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5", key: "11lu5j" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }],
  ["circle", { cx: "12", cy: "12", r: "7", key: "fim9np" }]
];
const Locate = createLucideIcon("locate", __iconNode$1);
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
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
const CITIES = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur"];
const PSYCHOLOGY_LABELS = [
  {
    label: "Most booked",
    color: "bg-secondary/10",
    textColor: "text-secondary"
  },
  { label: "Recommended", color: "bg-primary/10", textColor: "text-primary" },
  { label: "Top rated", color: "bg-emerald-50", textColor: "text-emerald-700" }
];
const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "1",
    title: "Book a Stay",
    desc: "Choose a verified property, pick your dates (min 15 days), and pay securely online."
  },
  {
    icon: ShieldCheck,
    step: "2",
    title: "Visit & Inspect",
    desc: "An executive will meet you at the property. Take 15–30 minutes to explore."
  },
  {
    icon: RefreshCw,
    step: "3",
    title: "Decide Instantly",
    desc: "Love it? Move in. Not satisfied? Get 90% refund instantly — no questions asked."
  }
];
function useFeaturedProperties() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["properties", "home"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(null);
    },
    enabled: !!actor && !isFetching
  });
}
function Home() {
  const navigate = useNavigate();
  const { data: properties, isLoading } = useFeaturedProperties();
  const [city, setCity] = reactExports.useState("Bhubaneswar");
  const [searchInput, setSearchInput] = reactExports.useState("");
  const [detectingLocation, setDetectingLocation] = reactExports.useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = reactExports.useState(false);
  const cityRef = reactExports.useRef(null);
  const verified = (properties == null ? void 0 : properties.filter((p) => p.status === "verified")) ?? [];
  const featured = verified.slice(0, 6);
  function handleSearch() {
    navigate({
      to: "/search",
      search: { city: searchInput || city }
    });
  }
  function handleDetectLocation() {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setCity("Bhubaneswar");
        setDetectingLocation(false);
      },
      () => setDetectingLocation(false),
      { timeout: 8e3 }
    );
  }
  reactExports.useEffect(() => {
    function handler(e) {
      if (cityRef.current && !cityRef.current.contains(e.target)) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
        className: "-mx-4 bg-gradient-to-b from-primary/8 to-transparent px-4 pb-6 pt-4",
        "data-ocid": "home.hero_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-2xl font-extrabold tracking-tight", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "X" }),
              "OLEN"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(XolenBadge, { size: "sm", className: "ml-1" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-[22px] font-bold leading-snug text-foreground", children: [
            "Flexible stays with",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "instant refund" }),
            " guarantee"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Book, visit, decide — 90% refund if not satisfied" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: cityRef, className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  role: "button",
                  tabIndex: 0,
                  "data-ocid": "home.city_selector",
                  onKeyDown: (e) => e.key === "Enter" && setCityDropdownOpen((o) => !o),
                  onClick: () => setCityDropdownOpen((o) => !o),
                  className: "flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm transition-smooth hover:border-primary/40",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 shrink-0 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-sm font-medium text-foreground", children: city }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "aria-label": "Detect my location",
                        "data-ocid": "home.detect_location_button",
                        onClick: (e) => {
                          e.stopPropagation();
                          handleDetectLocation();
                        },
                        className: "flex h-7 w-7 items-center justify-center rounded-lg bg-muted transition-smooth hover:bg-primary/10",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Locate,
                          {
                            className: `h-3.5 w-3.5 ${detectingLocation ? "animate-spin text-primary" : "text-muted-foreground"}`
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              cityDropdownOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-md",
                  "data-ocid": "home.city_dropdown",
                  children: CITIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setCity(c);
                        setCityDropdownOpen(false);
                      },
                      className: `flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-smooth hover:bg-muted ${city === c ? "font-semibold text-primary" : "text-foreground"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                        c,
                        city === c && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "ml-auto h-3.5 w-3.5 text-primary" })
                      ]
                    },
                    c
                  ))
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "text",
                    "data-ocid": "home.search_input",
                    value: searchInput,
                    onChange: (e) => setSearchInput(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && handleSearch(),
                    placeholder: "Search by area, landmark...",
                    className: "h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-smooth focus:border-primary focus:ring-1 focus:ring-primary/30"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "home.search_button",
                  onClick: handleSearch,
                  className: "rounded-xl px-4",
                  children: "Search"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -8 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.4, delay: 0.1 },
        className: "flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3",
        "data-ocid": "home.refund_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-emerald-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold text-emerald-800", children: "90% Refund Guarantee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-700", children: "Not satisfied after your visit? Get instant refund." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThumbsUp, { className: "h-4 w-4 shrink-0 text-emerald-600" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "home.featured_section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-bold text-foreground", children: "Featured Stays" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "home.view_all_button",
            onClick: () => navigate({ to: "/search", search: { city } }),
            className: "flex items-center gap-1 text-sm font-medium text-primary transition-smooth hover:underline",
            children: [
              "View all",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
        /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)
      )) }) : featured.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-border bg-muted/30 py-10 text-center",
          "data-ocid": "home.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "mx-auto mb-2 h-8 w-8 text-muted-foreground/40" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "No properties yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "More properties being verified daily" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: featured.map((p, i) => {
        const psychLabel = PSYCHOLOGY_LABELS[i % PSYCHOLOGY_LABELS.length];
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: i * 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              i < 3 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold ${psychLabel.color} ${psychLabel.textColor} ring-1 ring-current/20`,
                  children: psychLabel.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyCard, { property: p, index: i })
            ] })
          },
          String(p.id)
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "section",
      {
        className: "-mx-4 bg-muted/40 px-4 py-6",
        "data-ocid": "home.how_it_works_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-4 font-display text-lg font-bold text-foreground", children: "How XOLEN works" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { delay: i * 0.1 },
              className: "flex items-start gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display font-semibold text-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mr-1.5 text-xs font-bold text-muted-foreground", children: [
                      step,
                      "."
                    ] }),
                    title
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs leading-relaxed text-muted-foreground", children: desc })
                ] })
              ]
            },
            step
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              "data-ocid": "home.start_search_button",
              className: "mt-5 w-full rounded-xl",
              onClick: () => navigate({ to: "/search", search: { city } }),
              children: [
                "Find a Stay in ",
                city,
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  Home as default
};
