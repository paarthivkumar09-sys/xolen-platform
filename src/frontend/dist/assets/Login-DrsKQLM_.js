import { u as useAuth, a as useNavigate, r as reactExports, j as jsxRuntimeExports, L as LoaderCircle } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { u as useUserProfile } from "./useUserProfile-qKQZL8Mf.js";
import { S as Shield } from "./shield-CPLmzQpv.js";
import { S as Star } from "./star-BYQLLgFL.js";
import { Z as Zap } from "./zap-Dc9fS8p-.js";
import "./index-fYYCyfxq.js";
const TRUST_POINTS = [
  { icon: Shield, text: "XOLEN Verified properties only" },
  { icon: Star, text: "90% refund if not satisfied" },
  { icon: Zap, text: "Instant booking confirmation" }
];
function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!isAuthenticated || profileLoading) return;
    if (!profile) {
      navigate({ to: "/setup" });
    } else {
      switch (profile.role) {
        case "admin":
          navigate({ to: "/admin/dashboard" });
          break;
        case "owner":
          navigate({ to: "/owner/dashboard" });
          break;
        case "executive":
          navigate({ to: "/executive/tasks" });
          break;
        default:
          navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, profile, profileLoading, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen flex-col items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-bold tracking-tight", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "X" }),
        "OLEN"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-muted-foreground", children: "Stay + Services Platform" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/5 px-6 pt-6 pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground", children: "Find your perfect stay" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Minimum 15 days. Verified properties. Instant refund guarantee." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-6 py-4", children: TRUST_POINTS.map(({ icon: Icon, text }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: text })
      ] }, text)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        "data-ocid": "login.internet_identity_button",
        onClick: () => login(),
        disabled: isLoading || profileLoading,
        className: "w-full rounded-xl bg-primary py-6 font-display text-base font-bold text-primary-foreground shadow-md transition-smooth hover:bg-primary/90 active:scale-95",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          "Connecting..."
        ] }) : "Continue with Internet Identity"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-center text-xs text-muted-foreground", children: "Secure, decentralized login — no password required" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "text-primary hover:underline",
          children: "caffeine.ai"
        }
      )
    ] }) })
  ] }) });
}
export {
  Login as default
};
