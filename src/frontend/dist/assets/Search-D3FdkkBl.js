import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, g as useSearch, d as useActor, e as useQuery, S as Search, P as PropertyType, X, B as Building2, T as TenantType, f as createActor } from "./index-Dtbu2WTs.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, a as PresenceContext, b as usePresence, c as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion, P as PropertyCard } from "./proxy-CtJNT4ra.js";
import { S as SkeletonCard } from "./SkeletonCard-5UjpY3_A.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { M as MapPin } from "./map-pin-CehLSmlL.js";
import { C as ChevronDown } from "./chevron-down-BgQOSKxC.js";
import "./XolenBadge-ehPo_3Fe.js";
import "./circle-check-big-BSqXwEMY.js";
import "./skeleton-BQPfBTkU.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4", key: "obuewd" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4", key: "1q6298" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12", key: "1iu8h1" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12", key: "ntss68" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20", key: "14d8ph" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20", key: "m0wm8r" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6", key: "14e1ph" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14", key: "1i6ji0" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22", key: "1lctlv" }]
];
const SlidersHorizontal = createLucideIcon("sliders-horizontal", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  var _a;
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = ((_a = children.props) == null ? void 0 : _a.ref) ?? (children == null ? void 0 : children.ref);
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      var _a2;
      (_a2 = ref.current) == null ? void 0 : _a2.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender == null ? void 0 : forceRender();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && (safeToRemove == null ? void 0 : safeToRemove());
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const PROP_TYPES = [
  { value: "", label: "All" },
  { value: PropertyType.oneRK, label: "1 RK" },
  { value: PropertyType.oneBHK, label: "1 BHK" },
  { value: PropertyType.twoBHK, label: "2 BHK" },
  { value: PropertyType.threeBHK, label: "3 BHK" },
  { value: PropertyType.room, label: "Room" }
];
const TENANT_TYPES = [
  { value: "", label: "All Guests" },
  { value: TenantType.boys, label: "Boys" },
  { value: TenantType.girls, label: "Girls" },
  { value: TenantType.family, label: "Family" },
  { value: TenantType.all, label: "Mixed" }
];
const PRICE_PRESETS = [
  { label: "Any", min: 0, max: 0 },
  { label: "Under ₹500/day", min: 0, max: 500 },
  { label: "₹500–₹1000", min: 500, max: 1e3 },
  { label: "₹1000–₹2000", min: 1e3, max: 2e3 },
  { label: "₹2000+", min: 2e3, max: 0 }
];
function CustomerSearch() {
  const routeSearch = useSearch({ strict: false });
  const { actor, isFetching } = useActor(createActor);
  const [filterState, setFilterState] = reactExports.useState({
    city: routeSearch.city ?? "Bhubaneswar",
    propType: "",
    tenant: "",
    pricePreset: 0
  });
  const [cityInput, setCityInput] = reactExports.useState(routeSearch.city ?? "Bhubaneswar");
  const [drawerOpen, setDrawerOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (routeSearch.city) {
      setFilterState((s) => ({ ...s, city: routeSearch.city ?? s.city }));
      setCityInput(routeSearch.city);
    }
  }, [routeSearch.city]);
  const preset = PRICE_PRESETS[filterState.pricePreset];
  const filter = {
    ...filterState.city ? { city: filterState.city } : {},
    ...filterState.propType ? { propertyType: filterState.propType } : {},
    ...filterState.tenant ? { tenantType: filterState.tenant } : {},
    ...preset.min > 0 ? { minPrice: BigInt(preset.min) } : {},
    ...preset.max > 0 ? { maxPrice: BigInt(preset.max) } : {}
  };
  const { data: properties, isLoading } = useQuery({
    queryKey: ["search", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(Object.keys(filter).length ? filter : null);
    },
    enabled: !!actor && !isFetching
  });
  const results = (properties == null ? void 0 : properties.filter((p) => p.status === "verified")) ?? [];
  const activeFilterCount = [
    filterState.propType !== "",
    filterState.tenant !== "",
    filterState.pricePreset !== 0
  ].filter(Boolean).length;
  function applyCity() {
    setFilterState((s) => ({ ...s, city: cityInput }));
  }
  function clearFilters() {
    setFilterState((s) => ({
      ...s,
      propType: "",
      tenant: "",
      pricePreset: 0
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "Search Stays" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              "data-ocid": "search.city_input",
              value: cityInput,
              onChange: (e) => setCityInput(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && applyCity(),
              placeholder: "City or area...",
              className: "rounded-xl pl-9"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            "data-ocid": "search.submit_button",
            onClick: applyCity,
            className: "rounded-xl px-3",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "search.filter_button",
            onClick: () => setDrawerOpen(true),
            className: `relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-smooth ${activeFilterCount > 0 ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`,
            "aria-label": "Open filters",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4" }),
              activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground", children: activeFilterCount })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1 scrollbar-none", children: PROP_TYPES.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "data-ocid": `search.type_${label.replace(" ", "_").toLowerCase()}_filter`,
          onClick: () => setFilterState((s) => ({ ...s, propType: value })),
          className: `shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-smooth ${filterState.propType === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`,
          children: label
        },
        value || "all"
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block h-4 w-24 animate-pulse rounded bg-muted" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: results.length }),
        " ",
        results.length === 1 ? "property" : "properties",
        " in",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: filterState.city })
      ] }) }),
      activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          "data-ocid": "search.clear_filters_button",
          onClick: clearFilters,
          className: "flex items-center gap-1 text-xs font-medium text-primary hover:underline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
            "Clear filters"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3", children: Array.from({ length: 6 }).map((_, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
      /* @__PURE__ */ jsxRuntimeExports.jsx(SkeletonCard, {}, i)
    )) }) : results.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-muted/30 py-14 text-center",
        "data-ocid": "search.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "mx-auto mb-3 h-10 w-10 text-muted-foreground/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground", children: "No properties found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Try changing your city or adjusting filters" }),
          activeFilterCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: clearFilters,
              className: "mt-3 text-sm font-medium text-primary hover:underline",
              children: "Clear all filters"
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3", children: results.map((p, i) => {
      const hasAvailability = p.roomsAvailable > 0n;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          "data-ocid": `search.property.item.${i + 1}`,
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: Math.min(i * 0.05, 0.3) },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            !hasAvailability && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-card/80 backdrop-blur-[2px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground", children: "Unavailable" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyCard, { property: p, index: i })
          ] })
        },
        String(p.id)
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: drawerOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          className: "fixed inset-0 z-50 bg-foreground/40",
          onClick: () => setDrawerOpen(false)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          "data-ocid": "search.filter_drawer",
          initial: { y: "100%" },
          animate: { y: 0 },
          exit: { y: "100%" },
          transition: { type: "spring", damping: 30, stiffness: 300 },
          className: "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-card px-4 pb-10 pt-4 shadow-xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto mb-4 h-1 w-10 rounded-full bg-muted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4 text-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground", children: "Filters" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": "search.filter_close_button",
                  onClick: () => setDrawerOpen(false),
                  className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/70",
                  "aria-label": "Close filters",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Property Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: PROP_TYPES.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `search.drawer_type_${label.replace(" ", "_").toLowerCase()}_filter`,
                  onClick: () => setFilterState((s) => ({ ...s, propType: value })),
                  className: `rounded-full border px-3 py-1.5 text-xs font-semibold transition-smooth ${filterState.propType === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/40"}`,
                  children: label
                },
                value || "all"
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Suitable For" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: TENANT_TYPES.map(({ value, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  "data-ocid": `search.drawer_tenant_${value || "all"}_filter`,
                  onClick: () => setFilterState((s) => ({ ...s, tenant: value })),
                  className: `rounded-full border px-3 py-1.5 text-xs font-semibold transition-smooth ${filterState.tenant === value ? "border-secondary bg-secondary text-secondary-foreground" : "border-border bg-background text-muted-foreground hover:border-secondary/40"}`,
                  children: label
                },
                value || "all"
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground", children: "Price Range" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: PRICE_PRESETS.map(({ label }, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": `search.drawer_price_${idx}_filter`,
                  onClick: () => setFilterState((s) => ({ ...s, pricePreset: idx })),
                  className: `flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-smooth ${filterState.pricePreset === idx ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/30"}`,
                  children: [
                    label,
                    filterState.pricePreset === idx && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 rotate-[-90deg] text-primary" })
                  ]
                },
                label
              )) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  "data-ocid": "search.filter_clear_button",
                  onClick: clearFilters,
                  className: "flex-1 rounded-xl",
                  children: "Clear All"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  "data-ocid": "search.filter_apply_button",
                  onClick: () => setDrawerOpen(false),
                  className: "flex-1 rounded-xl",
                  children: "Show Results"
                }
              )
            ] })
          ]
        }
      )
    ] }) })
  ] });
}
export {
  CustomerSearch as default
};
