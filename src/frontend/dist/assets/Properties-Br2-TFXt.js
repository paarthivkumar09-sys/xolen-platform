import { c as createLucideIcon, r as reactExports, e as useQuery, j as jsxRuntimeExports, i as Link, h as PropertyStatus, B as Building2 } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { X as XolenBadge } from "./XolenBadge-ehPo_3Fe.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { P as Plus } from "./plus-DW8p3b6a.js";
import "./circle-check-big-BSqXwEMY.js";
import "./index-fYYCyfxq.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", key: "1m0v6g" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
      key: "ohrbg2"
    }
  ]
];
const SquarePen = createLucideIcon("square-pen", __iconNode);
const TYPE_LABELS = {
  oneRK: "1RK",
  oneBHK: "1BHK",
  twoBHK: "2BHK",
  threeBHK: "3BHK",
  room: "Room"
};
const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: PropertyStatus.pending },
  { label: "Verified", value: PropertyStatus.verified },
  { label: "Assigned", value: PropertyStatus.assigned },
  { label: "Rejected", value: PropertyStatus.rejected }
];
function PropertyListCard({
  property,
  index
}) {
  const isVerified = property.status === PropertyStatus.verified;
  const perDay = Math.ceil(Number(property.monthlyRent) / 30);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-smooth hover:shadow-md",
      "data-ocid": `owner_properties.item.${index}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-20 sm:w-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-7 w-7 sm:h-8 sm:w-8" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-sm font-bold text-foreground", children: TYPE_LABELS[property.propertyType] ?? property.propertyType }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "— ",
              property.location.city
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 truncate text-xs text-muted-foreground", children: property.location.address }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-sm text-primary", children: [
              "₹",
              perDay,
              "/day"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              "(₹",
              Number(property.monthlyRent).toLocaleString("en-IN"),
              "/mo)"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: property.status }),
            isVerified && /* @__PURE__ */ jsxRuntimeExports.jsx(XolenBadge, { size: "sm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/owner/property/$id/edit",
              params: { id: String(property.id) },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  "data-ocid": `owner_properties.edit_button.${index}`,
                  className: "gap-1.5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "h-3.5 w-3.5" }),
                    " Edit"
                  ]
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            Number(property.roomsAvailable),
            " rooms left"
          ] })
        ] })
      ]
    }
  );
}
function OwnerProperties() {
  const { actor, ready } = useBackend();
  const [filter, setFilter] = reactExports.useState("");
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["owner", "properties"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(null);
    },
    enabled: ready
  });
  const filtered = filter ? properties.filter((p) => p.status === filter) : properties;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "owner_properties.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground", children: "My Properties" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          properties.length,
          " propert",
          properties.length === 1 ? "y" : "ies",
          " ",
          "total"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/owner/property/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          "data-ocid": "owner_properties.add_button",
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add"
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex gap-2 overflow-x-auto pb-1",
        role: "tablist",
        "aria-label": "Filter properties",
        children: FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": filter === f.value,
            onClick: () => setFilter(f.value),
            "data-ocid": `owner_properties.filter_${f.label.toLowerCase()}.tab`,
            className: `shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-smooth ${filter === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
            children: f.label
          },
          f.value
        ))
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-xl" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-4 py-16 text-center",
        "data-ocid": "owner_properties.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-12 w-12 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "No properties found" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: filter ? "Try a different filter" : "Add your first property to get started" })
          ] }),
          !filter && /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/owner/property/new", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "owner_properties.add_first_property_button",
              className: "gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                " Add your first property"
              ]
            }
          ) })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(PropertyListCard, { property: p, index: i + 1 }, String(p.id))) })
  ] });
}
export {
  OwnerProperties as default
};
