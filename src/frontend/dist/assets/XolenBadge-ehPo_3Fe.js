import { j as jsxRuntimeExports } from "./index-Dtbu2WTs.js";
import { C as CircleCheckBig } from "./circle-check-big-BSqXwEMY.js";
function XolenBadge({ size = "sm", className = "" }) {
  const isSmall = size === "sm";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 ring-1 ring-emerald-200 ${isSmall ? "text-[11px]" : "text-xs"} ${className}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CircleCheckBig,
          {
            className: isSmall ? "h-3 w-3" : "h-3.5 w-3.5",
            strokeWidth: 2.5
          }
        ),
        "XOLEN Verified"
      ]
    }
  );
}
export {
  XolenBadge as X
};
