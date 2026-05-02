import { r as reactExports, j as jsxRuntimeExports, L as LoaderCircle, b as ue } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { L as Label } from "./label-CKhum0p5.js";
import { u as useUserProfile } from "./useUserProfile-qKQZL8Mf.js";
import "./index-fYYCyfxq.js";
function OwnerSettings() {
  const { profile, updateProfile, isUpdating } = useUserProfile();
  const [name, setName] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setEmail(profile.email);
    }
  }, [profile]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        phone,
        email,
        role: (profile == null ? void 0 : profile.role) ?? "owner"
      });
      ue.success("Profile updated!");
    } catch {
      ue.error("Failed to update");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-lg space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Settings" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Full Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "owner_settings.name_input",
            value: name,
            onChange: (e) => setName(e.target.value),
            className: "mt-1 rounded-xl"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Phone" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "owner_settings.phone_input",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            className: "mt-1 rounded-xl"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            "data-ocid": "owner_settings.email_input",
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            className: "mt-1 rounded-xl"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "submit",
          "data-ocid": "owner_settings.save_button",
          disabled: isUpdating,
          className: "rounded-xl bg-primary text-primary-foreground",
          children: isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Save Changes"
        }
      )
    ] })
  ] });
}
export {
  OwnerSettings as default
};
