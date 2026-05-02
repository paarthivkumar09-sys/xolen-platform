const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-Dtbu2WTs.js","assets/index-B0imLQnh.css"])))=>i.map(i=>d[i]);
import { c as createLucideIcon, u as useAuth, d as useActor, r as reactExports, n as useMutation, j as jsxRuntimeExports, X, t as LogOut, b as ue, _ as __vitePreload, v as UploadedBy, w as DocType, f as createActor } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { L as Label } from "./label-CKhum0p5.js";
import { S as Skeleton } from "./skeleton-BQPfBTkU.js";
import { u as useUserProfile } from "./useUserProfile-qKQZL8Mf.js";
import { S as Shield } from "./shield-CPLmzQpv.js";
import { C as ChevronRight } from "./chevron-right-CuGYFeKb.js";
import { C as Check } from "./check-yaw8C9ek.js";
import { F as FileText } from "./file-text-2x1X94gD.js";
import { U as Upload } from "./upload-LY-80_KF.js";
import "./index-fYYCyfxq.js";
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
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function AvatarInitials({ name }) {
  const initials = name.split(" ").map((w) => {
    var _a;
    return ((_a = w[0]) == null ? void 0 : _a.toUpperCase()) ?? "";
  }).slice(0, 2).join("");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground shadow-sm", children: initials || "?" });
}
const ROLE_LABELS = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
  executive: "Executive"
};
function CustomerProfile() {
  const { profile, isLoading, updateProfile, isSaving, isUpdating } = useUserProfile();
  const { logout, principal } = useAuth();
  const { actor } = useActor(createActor);
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [formName, setFormName] = reactExports.useState("");
  const [formPhone, setFormPhone] = reactExports.useState("");
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  function startEdit() {
    setFormName((profile == null ? void 0 : profile.name) ?? "");
    setFormPhone((profile == null ? void 0 : profile.phone) ?? "");
    setIsEditing(true);
  }
  async function handleSave() {
    if (!profile) return;
    try {
      await updateProfile({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: profile.email,
        role: profile.role
      });
      setIsEditing(false);
      ue.success("Profile updated");
    } catch {
      ue.error("Failed to update profile");
    }
  }
  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { ExternalBlob } = await __vitePreload(async () => {
        const { ExternalBlob: ExternalBlob2 } = await import("./index-Dtbu2WTs.js").then((n) => n.a0);
        return { ExternalBlob: ExternalBlob2 };
      }, true ? __vite__mapDeps([0,1]) : void 0);
      const blob = ExternalBlob.fromBytes(bytes);
      const input = {
        bookingId: BigInt(0),
        fileBlob: blob,
        docType: DocType.aadhaar,
        uploadedBy: UploadedBy.customer
      };
      return actor.createDocument(input);
    },
    onSuccess: () => {
      ue.success("ID document uploaded successfully");
      setIsUploading(false);
    },
    onError: () => {
      ue.error("Failed to upload document");
      setIsUploading(false);
    }
  });
  async function handleFileChange(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    setIsUploading(true);
    uploadMutation.mutate(file);
    e.target.value = "";
  }
  if (isLoading)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-32" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-16 rounded-full shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-36" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-24" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" })
      ] })
    ] });
  const displayName = (profile == null ? void 0 : profile.name) ?? "User";
  const displayEmail = (profile == null ? void 0 : profile.email) || (principal ? `${principal.toString().slice(0, 20)}…` : "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Profile" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarInitials, { name: displayName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate font-display text-lg font-bold text-foreground", children: displayName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm text-muted-foreground", children: displayEmail }),
        (profile == null ? void 0 : profile.role) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 inline-flex items-center rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-semibold text-secondary", children: ROLE_LABELS[profile.role] ?? profile.role })
      ] }),
      profile && /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatusBadge,
        {
          status: profile.verificationStatus,
          className: "shrink-0"
        }
      )
    ] }) }),
    (profile == null ? void 0 : profile.verificationStatus) === "unverified" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 rounded-xl border border-secondary/30 bg-secondary/8 px-4 py-3",
        "data-ocid": "profile.verify_id_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-5 w-5 text-secondary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Verify Your ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Required to complete your check-in" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-secondary shrink-0" })
        ]
      }
    ),
    isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-border bg-card p-4 space-y-4",
        "data-ocid": "profile.edit_form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Edit Profile" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-name", className: "text-sm", children: "Full Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-name",
                  "data-ocid": "profile.name_input",
                  value: formName,
                  onChange: (e) => setFormName(e.target.value),
                  placeholder: "Your full name",
                  className: "rounded-xl"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit-phone", className: "text-sm", children: "Phone Number" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-phone",
                  "data-ocid": "profile.phone_input",
                  value: formPhone,
                  onChange: (e) => setFormPhone(e.target.value),
                  placeholder: "+91 98765 43210",
                  type: "tel",
                  className: "rounded-xl"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "profile.save_button",
                onClick: handleSave,
                disabled: isSaving || isUpdating,
                className: "flex-1 rounded-xl",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1.5 h-4 w-4" }),
                  isSaving || isUpdating ? "Saving…" : "Save Changes"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                "data-ocid": "profile.cancel_button",
                variant: "outline",
                onClick: () => setIsEditing(false),
                className: "flex-1 rounded-xl",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-4 w-4" }),
                  " Cancel"
                ]
              }
            )
          ] })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card divide-y divide-border", children: [
      { label: "Name", value: (profile == null ? void 0 : profile.name) || "Not set" },
      { label: "Phone", value: (profile == null ? void 0 : profile.phone) || "Not set" },
      { label: "Email", value: (profile == null ? void 0 : profile.email) || "Not set" }
    ].map(({ label, value }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between px-4 py-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[55%] truncate text-right text-sm font-medium text-foreground", children: value })
        ]
      },
      label
    )) }),
    !isEditing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        "data-ocid": "profile.edit_button",
        variant: "outline",
        onClick: startEdit,
        className: "w-full rounded-xl",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "mr-2 h-4 w-4" }),
          " Edit Profile"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm", children: "ID Document" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Upload Aadhaar, Passport, or Driving License for check-in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: "image/*,application/pdf",
          className: "hidden",
          onChange: handleFileChange,
          "aria-label": "Upload ID document"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          "data-ocid": "profile.upload_button",
          variant: "outline",
          onClick: () => {
            var _a;
            return (_a = fileInputRef.current) == null ? void 0 : _a.click();
          },
          disabled: isUploading || uploadMutation.isPending,
          className: "w-full rounded-xl border-dashed border-2 py-6 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
            isUploading || uploadMutation.isPending ? "Uploading…" : "Upload ID Document"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        type: "button",
        "data-ocid": "profile.logout_button",
        onClick: () => logout(),
        variant: "outline",
        className: "w-full rounded-xl border-destructive text-destructive hover:bg-destructive/5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "mr-2 h-4 w-4" }),
          " Sign Out"
        ]
      }
    )
  ] });
}
export {
  CustomerProfile as default
};
