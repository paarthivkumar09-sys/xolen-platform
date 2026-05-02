import { a as useNavigate, r as reactExports, F as FurnishingType, T as TenantType, P as PropertyType, n as useMutation, j as jsxRuntimeExports, X, b as ue, E as ExternalBlob } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { L as Label } from "./label-CKhum0p5.js";
import { T as Textarea } from "./textarea-DCEjf_28.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { A as ArrowLeft } from "./arrow-left-BDd94EwB.js";
import { U as Upload } from "./upload-LY-80_KF.js";
import { A as ArrowRight } from "./arrow-right-Bmt7xBgI.js";
import { C as CircleCheck } from "./circle-check-B7IaRigW.js";
import "./index-fYYCyfxq.js";
const PROPERTY_TYPES = [
  { value: PropertyType.oneRK, label: "1RK" },
  { value: PropertyType.oneBHK, label: "1BHK" },
  { value: PropertyType.twoBHK, label: "2BHK" },
  { value: PropertyType.threeBHK, label: "3BHK" },
  { value: PropertyType.room, label: "Room" }
];
const TENANT_TYPES = [
  { value: TenantType.boys, label: "Boys" },
  { value: TenantType.girls, label: "Girls" },
  { value: TenantType.family, label: "Family" },
  { value: TenantType.all, label: "All Allowed" }
];
const FURNISHING_TYPES = [
  { value: FurnishingType.furnished, label: "Furnished" },
  { value: FurnishingType.semiFurnished, label: "Semi-Furnished" },
  { value: FurnishingType.unfurnished, label: "Unfurnished" }
];
const STEPS = ["Details", "Location", "Description", "Photos"];
const INITIAL = {
  propertyType: PropertyType.oneBHK,
  monthlyRent: "",
  maxGuests: "2",
  totalRooms: "1",
  roomsAvailable: "1",
  tenantType: TenantType.all,
  furnishingType: FurnishingType.furnished,
  city: "Bhubaneswar",
  address: "",
  description: "",
  photos: []
};
function StepIndicator({ current, total }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center gap-2", children: STEPS.map((label, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-smooth ${i < current ? "bg-primary text-primary-foreground" : i === current ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : "bg-muted text-muted-foreground"}`,
        children: i < current ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : i + 1
      }
    ),
    i < total - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-0.5 w-6 rounded ${i < current ? "bg-primary" : "bg-border"}`
      }
    )
  ] }, label)) });
}
function PropertyNew() {
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const [step, setStep] = reactExports.useState(0);
  const [form, setForm] = reactExports.useState(INITIAL);
  const [photoPreviews, setPhotoPreviews] = reactExports.useState([]);
  const fileRef = reactExports.useRef(null);
  const perDay = form.monthlyRent ? Math.ceil(Number(form.monthlyRent) / 30) : 0;
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const photoBlobs = await Promise.all(
        form.photos.map(async (file) => {
          const buf = new Uint8Array(await file.arrayBuffer());
          return ExternalBlob.fromBytes(buf);
        })
      );
      const input = {
        propertyType: form.propertyType,
        monthlyRent: BigInt(Number(form.monthlyRent)),
        maxGuests: BigInt(Number(form.maxGuests)),
        totalRooms: BigInt(Number(form.totalRooms)),
        roomsAvailable: BigInt(Number(form.roomsAvailable)),
        tenantType: form.tenantType,
        furnishingType: form.furnishingType,
        location: { city: form.city, address: form.address, lat: 0, lng: 0 },
        description: form.description,
        amenities: [],
        photos: photoBlobs
      };
      return actor.createProperty(input);
    },
    onSuccess: () => {
      ue.success("Property submitted for verification!");
      navigate({ to: "/owner/properties" });
    },
    onError: (err) => {
      ue.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }
  function handleFiles(files) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 6 - form.photos.length);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
    setPhotoPreviews((prev) => [...prev, ...previews]);
  }
  function removePhoto(index) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }
  const canAdvance = (() => {
    if (step === 0)
      return form.monthlyRent !== "" && Number(form.monthlyRent) > 0;
    if (step === 1)
      return form.city.trim() !== "" && form.address.trim() !== "";
    if (step === 2) return form.description.trim().length > 10;
    return true;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-lg", "data-ocid": "owner_property_new.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => step === 0 ? navigate({ to: "/owner/properties" }) : setStep((s) => s - 1),
          className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80",
          "data-ocid": "owner_property_new.back_button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-foreground", children: "Add New Property" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Step ",
          step + 1,
          " of ",
          STEPS.length,
          ": ",
          STEPS[step]
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StepIndicator, { current: step, total: STEPS.length }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-xl border border-border bg-card p-5 shadow-sm", children: [
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm font-semibold", children: "Property Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-5", children: PROPERTY_TYPES.map((pt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => set("propertyType", pt.value),
              "data-ocid": `owner_property_new.type_${pt.label.toLowerCase()}.toggle`,
              className: `rounded-lg border-2 py-2 text-sm font-semibold transition-smooth ${form.propertyType === pt.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`,
              children: pt.label
            },
            pt.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "monthly-rent",
              className: "mb-1 block text-sm font-semibold",
              children: "Monthly Rent (₹)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "monthly-rent",
              type: "number",
              min: 0,
              placeholder: "e.g. 8000",
              value: form.monthlyRent,
              onChange: (e) => set("monthlyRent", e.target.value),
              "data-ocid": "owner_property_new.monthly_rent.input"
            }
          ),
          perDay > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
            "Per-day price shown to guests:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-primary", children: [
              "₹",
              perDay,
              "/day"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "max-guests",
                className: "mb-1 block text-sm font-semibold",
                children: "Max Guests"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "max-guests",
                type: "number",
                min: 1,
                max: 20,
                value: form.maxGuests,
                onChange: (e) => set("maxGuests", e.target.value),
                "data-ocid": "owner_property_new.max_guests.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "total-rooms",
                className: "mb-1 block text-sm font-semibold",
                children: "Total Rooms"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "total-rooms",
                type: "number",
                min: 1,
                value: form.totalRooms,
                onChange: (e) => set("totalRooms", e.target.value),
                "data-ocid": "owner_property_new.total_rooms.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm font-semibold", children: "Tenant Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: TENANT_TYPES.map((tt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: `flex cursor-pointer items-center gap-2.5 rounded-lg border-2 p-3 transition-smooth ${form.tenantType === tt.value ? "border-primary bg-primary/10" : "border-border bg-muted hover:border-primary/40"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    name: "tenantType",
                    value: tt.value,
                    checked: form.tenantType === tt.value,
                    onChange: () => set("tenantType", tt.value),
                    "data-ocid": `owner_property_new.tenant_${tt.label.toLowerCase().replace(" ", "_")}.radio`,
                    className: "h-4 w-4 accent-primary"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-sm font-medium ${form.tenantType === tt.value ? "text-primary" : "text-foreground"}`,
                    children: tt.label
                  }
                )
              ]
            },
            tt.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm font-semibold", children: "Furnishing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: FURNISHING_TYPES.map((ft) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => set("furnishingType", ft.value),
              "data-ocid": `owner_property_new.furnishing_${ft.value}.toggle`,
              className: `rounded-lg border-2 py-2 text-xs font-semibold transition-smooth ${form.furnishingType === ft.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`,
              children: ft.label
            },
            ft.value
          )) })
        ] })
      ] }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "city",
              className: "mb-1 block text-sm font-semibold",
              children: "City"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "city",
              placeholder: "e.g. Bhubaneswar",
              value: form.city,
              onChange: (e) => set("city", e.target.value),
              "data-ocid": "owner_property_new.city.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Label,
            {
              htmlFor: "address",
              className: "mb-1 block text-sm font-semibold",
              children: "Full Address"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "address",
              placeholder: "Street, locality, landmark...",
              rows: 3,
              value: form.address,
              onChange: (e) => set("address", e.target.value),
              "data-ocid": "owner_property_new.address.textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground", children: "📍 Our executive will physically verify the location during the approval process." })
      ] }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Label,
          {
            htmlFor: "desc",
            className: "mb-1 block text-sm font-semibold",
            children: "Property Description"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "desc",
            placeholder: "Describe your property — size, nearby facilities, unique features...",
            rows: 6,
            value: form.description,
            onChange: (e) => set("description", e.target.value),
            "data-ocid": "owner_property_new.description.textarea"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-right text-xs text-muted-foreground", children: [
          form.description.length,
          " chars"
        ] })
      ] }) }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm font-semibold", children: "Upload Photos (max 6)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileRef.current) == null ? void 0 : _a.click();
              },
              "data-ocid": "owner_property_new.upload_button",
              className: "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 py-8 transition-smooth hover:border-primary/50 hover:bg-primary/5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-8 w-8 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Tap to upload photos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "JPG, PNG, WEBP • Max 6 photos" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileRef,
              type: "file",
              accept: "image/*",
              multiple: true,
              className: "hidden",
              onChange: (e) => handleFiles(e.target.files),
              "data-ocid": "owner_property_new.dropzone"
            }
          )
        ] }),
        photoPreviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: photoPreviews.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative aspect-square overflow-hidden rounded-lg bg-muted",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src,
                  alt: `Preview ${i + 1}`,
                  className: "h-full w-full object-cover"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => removePhoto(i),
                  className: "absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-background",
                  "aria-label": "Remove photo",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                }
              )
            ]
          },
          src
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground", children: "📸 Our executive will also take verified photos during the inspection." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex gap-3", children: [
      step > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          className: "flex-1",
          onClick: () => setStep((s) => s - 1),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-1.5 h-4 w-4" }),
            " Back"
          ]
        }
      ),
      step < STEPS.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          className: "flex-1",
          disabled: !canAdvance,
          onClick: () => setStep((s) => s + 1),
          "data-ocid": "owner_property_new.next_button",
          children: [
            "Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-1.5 h-4 w-4" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          className: "flex-1",
          disabled: mutation.isPending || !ready,
          onClick: () => mutation.mutate(),
          "data-ocid": "owner_property_new.submit_button",
          children: mutation.isPending ? "Submitting..." : "Submit Property"
        }
      )
    ] }),
    mutation.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "mt-3 text-center text-sm text-emerald-600",
        "data-ocid": "owner_property_new.success_state",
        children: "✅ Property submitted! Pending XOLEN verification."
      }
    )
  ] });
}
export {
  PropertyNew as default
};
