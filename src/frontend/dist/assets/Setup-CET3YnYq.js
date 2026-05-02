import { a as useNavigate, r as reactExports, U as UserRole, j as jsxRuntimeExports, L as LoaderCircle, b as ue } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { L as Label } from "./label-CKhum0p5.js";
import { u as useUserProfile } from "./useUserProfile-qKQZL8Mf.js";
import "./index-fYYCyfxq.js";
const ROLE_OPTIONS = [
  {
    role: UserRole.customer,
    label: "Guest / Tenant",
    description: "Browse and book verified stays",
    emoji: "🏠"
  },
  {
    role: UserRole.owner,
    label: "Property Owner",
    description: "List and manage your properties",
    emoji: "🔑"
  }
];
function Setup() {
  const navigate = useNavigate();
  const { saveProfile, isSaving } = useUserProfile();
  const [selectedRole, setSelectedRole] = reactExports.useState(UserRole.customer);
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      ue.error("Please fill in your name and phone number");
      return;
    }
    try {
      await saveProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role: selectedRole
      });
      ue.success("Profile created! Welcome to XOLEN.");
      if (selectedRole === UserRole.owner) {
        navigate({ to: "/owner/dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } catch {
      ue.error("Failed to save profile. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen flex-col items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-3xl font-bold", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "X" }),
        "OLEN"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-muted-foreground", children: "Let's set up your account" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm font-semibold", children: "I am a..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: ROLE_OPTIONS.map(({ role, label, description, emoji }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `setup.role_${role}_toggle`,
            onClick: () => setSelectedRole(role),
            className: `rounded-xl border p-4 text-left transition-smooth ${selectedRole === role ? "border-primary bg-primary/5 ring-2 ring-primary/30" : "border-border bg-card hover:border-primary/40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: emoji }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 font-semibold text-sm text-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: description })
            ]
          },
          role
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "text-sm font-semibold", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "name",
            "data-ocid": "setup.name_input",
            value: name,
            onChange: (e) => setName(e.target.value),
            placeholder: "Enter your full name",
            className: "mt-1 rounded-xl",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", className: "text-sm font-semibold", children: "Phone Number" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "phone",
            "data-ocid": "setup.phone_input",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            placeholder: "+91 98765 43210",
            type: "tel",
            className: "mt-1 rounded-xl",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "email", className: "text-sm font-semibold", children: [
          "Email",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal text-muted-foreground", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "email",
            "data-ocid": "setup.email_input",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            placeholder: "you@example.com",
            type: "email",
            className: "mt-1 rounded-xl"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          "data-ocid": "setup.submit_button",
          disabled: isSaving,
          className: "w-full rounded-xl bg-primary py-6 font-display text-base font-bold text-primary-foreground shadow-md transition-smooth hover:bg-primary/90",
          children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
            "Saving..."
          ] }) : "Get Started →"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
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
  Setup as default
};
