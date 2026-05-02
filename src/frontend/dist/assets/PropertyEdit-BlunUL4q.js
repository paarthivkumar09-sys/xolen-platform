import { a as useNavigate, l as useParams, m as useQueryClient, r as reactExports, e as useQuery, F as FurnishingType, T as TenantType, P as PropertyType, n as useMutation, j as jsxRuntimeExports, L as LoaderCircle, X, b as ue, E as ExternalBlob } from "./index-Dtbu2WTs.js";
import { S as StatusBadge } from "./StatusBadge-CO4zHwJV.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { I as Input } from "./input-B8IgUwYt.js";
import { L as Label } from "./label-CKhum0p5.js";
import { T as Textarea } from "./textarea-DCEjf_28.js";
import { u as useBackend } from "./useBackend-DGHYg3qY.js";
import { A as ArrowLeft } from "./arrow-left-BDd94EwB.js";
import { U as Upload } from "./upload-LY-80_KF.js";
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
function PropertyEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false });
  const { actor, ready } = useBackend();
  const qc = useQueryClient();
  const fileRef = reactExports.useRef(null);
  const [newPreviews, setNewPreviews] = reactExports.useState([]);
  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(BigInt(id));
    },
    enabled: ready && !!id
  });
  const [form, setForm] = reactExports.useState({
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
    newPhotos: []
  });
  reactExports.useEffect(() => {
    if (!property) return;
    setForm({
      propertyType: property.propertyType,
      monthlyRent: String(Number(property.monthlyRent)),
      maxGuests: String(Number(property.maxGuests)),
      totalRooms: String(Number(property.totalRooms)),
      roomsAvailable: String(Number(property.roomsAvailable)),
      tenantType: property.tenantType,
      furnishingType: property.furnishingType,
      city: property.location.city,
      address: property.location.address,
      description: property.description,
      newPhotos: []
    });
  }, [property]);
  const perDay = form.monthlyRent ? Math.ceil(Number(form.monthlyRent) / 30) : 0;
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const newBlobs = await Promise.all(
        form.newPhotos.map(async (file) => {
          const buf = new Uint8Array(await file.arrayBuffer());
          return ExternalBlob.fromBytes(buf);
        })
      );
      const existingPhotos = (property == null ? void 0 : property.photos) ?? [];
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
        amenities: (property == null ? void 0 : property.amenities) ?? [],
        photos: [...existingPhotos, ...newBlobs]
      };
      return actor.updateProperty(BigInt(id), input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["owner", "properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
      ue.success("Property updated!");
      navigate({ to: "/owner/properties" });
    },
    onError: (err) => {
      ue.error(
        `Update failed: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  });
  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }
  function handleFiles(files) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 6);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      newPhotos: [...prev.newPhotos, ...newFiles]
    }));
    setNewPreviews((prev) => [...prev, ...previews]);
  }
  function removeNewPhoto(index) {
    setForm((prev) => ({
      ...prev,
      newPhotos: prev.newPhotos.filter((_, i) => i !== index)
    }));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }
  if (isLoading || !property) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex min-h-64 items-center justify-center",
        "data-ocid": "owner_property_edit.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-lg", "data-ocid": "owner_property_edit.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/owner/properties" }),
          className: "flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80",
          "data-ocid": "owner_property_edit.back_button",
          "aria-label": "Back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-foreground", children: "Edit Property" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "ID #",
            id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: property.status })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          mutation.mutate();
        },
        className: "space-y-5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-sm space-y-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-sm font-semibold", children: "Property Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 sm:grid-cols-5", children: PROPERTY_TYPES.map((pt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => set("propertyType", pt.value),
                  "data-ocid": `owner_property_edit.type_${pt.label.toLowerCase()}.toggle`,
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
                  htmlFor: "edit-rent",
                  className: "mb-1 block text-sm font-semibold",
                  children: "Monthly Rent (₹)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-rent",
                  type: "number",
                  min: 0,
                  value: form.monthlyRent,
                  onChange: (e) => set("monthlyRent", e.target.value),
                  "data-ocid": "owner_property_edit.monthly_rent.input"
                }
              ),
              perDay > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-muted-foreground", children: [
                "Per-day:",
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
                    htmlFor: "edit-guests",
                    className: "mb-1 block text-sm font-semibold",
                    children: "Max Guests"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "edit-guests",
                    type: "number",
                    min: 1,
                    value: form.maxGuests,
                    onChange: (e) => set("maxGuests", e.target.value),
                    "data-ocid": "owner_property_edit.max_guests.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Label,
                  {
                    htmlFor: "edit-rooms",
                    className: "mb-1 block text-sm font-semibold",
                    children: "Rooms Available"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "edit-rooms",
                    type: "number",
                    min: 0,
                    value: form.roomsAvailable,
                    onChange: (e) => set("roomsAvailable", e.target.value),
                    "data-ocid": "owner_property_edit.rooms_available.input"
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
                        name: "editTenantType",
                        value: tt.value,
                        checked: form.tenantType === tt.value,
                        onChange: () => set("tenantType", tt.value),
                        "data-ocid": `owner_property_edit.tenant_${tt.label.toLowerCase().replace(" ", "_")}.radio`,
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
                  "data-ocid": `owner_property_edit.furnishing_${ft.value}.toggle`,
                  className: `rounded-lg border-2 py-2 text-xs font-semibold transition-smooth ${form.furnishingType === ft.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted text-muted-foreground hover:border-primary/50"}`,
                  children: ft.label
                },
                ft.value
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Location" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "edit-city",
                  className: "mb-1 block text-sm font-semibold",
                  children: "City"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "edit-city",
                  value: form.city,
                  onChange: (e) => set("city", e.target.value),
                  "data-ocid": "owner_property_edit.city.input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "edit-address",
                  className: "mb-1 block text-sm font-semibold",
                  children: "Address"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "edit-address",
                  rows: 3,
                  value: form.address,
                  onChange: (e) => set("address", e.target.value),
                  "data-ocid": "owner_property_edit.address.textarea"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 5,
                value: form.description,
                onChange: (e) => set("description", e.target.value),
                placeholder: "Describe your property...",
                "data-ocid": "owner_property_edit.description.textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 shadow-sm space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Add New Photos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => {
                  var _a;
                  return (_a = fileRef.current) == null ? void 0 : _a.click();
                },
                "data-ocid": "owner_property_edit.upload_button",
                className: "flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 py-6 transition-smooth hover:border-primary/50 hover:bg-primary/5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: "Tap to upload" })
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
                "data-ocid": "owner_property_edit.dropzone"
              }
            ),
            newPreviews.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: newPreviews.map((src, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "relative aspect-square overflow-hidden rounded-lg bg-muted",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src,
                      alt: `New ${i + 1}`,
                      className: "h-full w-full object-cover"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => removeNewPhoto(i),
                      className: "absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-background",
                      "aria-label": "Remove",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                    }
                  )
                ]
              },
              src
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full",
              disabled: mutation.isPending || !ready,
              "data-ocid": "owner_property_edit.submit_button",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                " Saving..."
              ] }) : "Save Changes"
            }
          ),
          mutation.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-center text-sm text-emerald-600",
              "data-ocid": "owner_property_edit.success_state",
              children: "✅ Property updated successfully!"
            }
          ),
          mutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-center text-sm text-destructive",
              "data-ocid": "owner_property_edit.error_state",
              children: "Failed to update. Please try again."
            }
          )
        ]
      }
    )
  ] });
}
export {
  PropertyEdit as default
};
