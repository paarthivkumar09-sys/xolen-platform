import { ExternalBlob } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/useBackend";
import {
  FurnishingType,
  type PropertyInput,
  PropertyType,
  TenantType,
} from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: PropertyType.oneRK, label: "1RK" },
  { value: PropertyType.oneBHK, label: "1BHK" },
  { value: PropertyType.twoBHK, label: "2BHK" },
  { value: PropertyType.threeBHK, label: "3BHK" },
  { value: PropertyType.room, label: "Room" },
];

const TENANT_TYPES: { value: TenantType; label: string }[] = [
  { value: TenantType.boys, label: "Boys" },
  { value: TenantType.girls, label: "Girls" },
  { value: TenantType.family, label: "Family" },
  { value: TenantType.all, label: "All Allowed" },
];

const FURNISHING_TYPES: { value: FurnishingType; label: string }[] = [
  { value: FurnishingType.furnished, label: "Furnished" },
  { value: FurnishingType.semiFurnished, label: "Semi-Furnished" },
  { value: FurnishingType.unfurnished, label: "Unfurnished" },
];

const STEPS = ["Details", "Location", "Description", "Photos"];

interface FormState {
  propertyType: PropertyType;
  monthlyRent: string;
  maxGuests: string;
  totalRooms: string;
  roomsAvailable: string;
  tenantType: TenantType;
  furnishingType: FurnishingType;
  city: string;
  address: string;
  description: string;
  photos: File[];
}

const INITIAL: FormState = {
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
  photos: [],
};

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-smooth ${
              i < current
                ? "bg-primary text-primary-foreground"
                : i === current
                  ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i < current ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`h-0.5 w-6 rounded ${i < current ? "bg-primary" : "bg-border"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PropertyNew() {
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const perDay = form.monthlyRent
    ? Math.ceil(Number(form.monthlyRent) / 30)
    : 0;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const photoBlobs: ExternalBlob[] = await Promise.all(
        form.photos.map(async (file) => {
          const buf = new Uint8Array(await file.arrayBuffer());
          return ExternalBlob.fromBytes(buf);
        }),
      );
      const input: PropertyInput = {
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
        photos: photoBlobs,
      };
      return actor.createProperty(input);
    },
    onSuccess: () => {
      toast.success("Property submitted for verification!");
      navigate({ to: "/owner/properties" });
    },
    onError: (err) => {
      toast.error(
        `Failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 6 - form.photos.length);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({ ...prev, photos: [...prev.photos, ...newFiles] }));
    setPhotoPreviews((prev) => [...prev, ...previews]);
  }

  function removePhoto(index: number) {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
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

  return (
    <div className="mx-auto max-w-lg" data-ocid="owner_property_new.page">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            step === 0
              ? navigate({ to: "/owner/properties" })
              : setStep((s) => s - 1)
          }
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
          data-ocid="owner_property_new.back_button"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-foreground">
            Add New Property
          </h1>
          <p className="text-xs text-muted-foreground">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>
      </div>

      <StepIndicator current={step} total={STEPS.length} />

      <div className="mt-6 rounded-xl border border-border bg-card p-5 shadow-sm">
        {/* Step 0 — Details */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block text-sm font-semibold">
                Property Type
              </Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    type="button"
                    key={pt.value}
                    onClick={() => set("propertyType", pt.value)}
                    data-ocid={`owner_property_new.type_${pt.label.toLowerCase()}.toggle`}
                    className={`rounded-lg border-2 py-2 text-sm font-semibold transition-smooth ${
                      form.propertyType === pt.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label
                htmlFor="monthly-rent"
                className="mb-1 block text-sm font-semibold"
              >
                Monthly Rent (₹)
              </Label>
              <Input
                id="monthly-rent"
                type="number"
                min={0}
                placeholder="e.g. 8000"
                value={form.monthlyRent}
                onChange={(e) => set("monthlyRent", e.target.value)}
                data-ocid="owner_property_new.monthly_rent.input"
              />
              {perDay > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Per-day price shown to guests:{" "}
                  <span className="font-semibold text-primary">
                    ₹{perDay}/day
                  </span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label
                  htmlFor="max-guests"
                  className="mb-1 block text-sm font-semibold"
                >
                  Max Guests
                </Label>
                <Input
                  id="max-guests"
                  type="number"
                  min={1}
                  max={20}
                  value={form.maxGuests}
                  onChange={(e) => set("maxGuests", e.target.value)}
                  data-ocid="owner_property_new.max_guests.input"
                />
              </div>
              <div>
                <Label
                  htmlFor="total-rooms"
                  className="mb-1 block text-sm font-semibold"
                >
                  Total Rooms
                </Label>
                <Input
                  id="total-rooms"
                  type="number"
                  min={1}
                  value={form.totalRooms}
                  onChange={(e) => set("totalRooms", e.target.value)}
                  data-ocid="owner_property_new.total_rooms.input"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold">
                Tenant Type
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {TENANT_TYPES.map((tt) => (
                  <label
                    key={tt.value}
                    className={`flex cursor-pointer items-center gap-2.5 rounded-lg border-2 p-3 transition-smooth ${
                      form.tenantType === tt.value
                        ? "border-primary bg-primary/10"
                        : "border-border bg-muted hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="tenantType"
                      value={tt.value}
                      checked={form.tenantType === tt.value}
                      onChange={() => set("tenantType", tt.value)}
                      data-ocid={`owner_property_new.tenant_${tt.label.toLowerCase().replace(" ", "_")}.radio`}
                      className="h-4 w-4 accent-primary"
                    />
                    <span
                      className={`text-sm font-medium ${
                        form.tenantType === tt.value
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {tt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-semibold">
                Furnishing
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {FURNISHING_TYPES.map((ft) => (
                  <button
                    type="button"
                    key={ft.value}
                    onClick={() => set("furnishingType", ft.value)}
                    data-ocid={`owner_property_new.furnishing_${ft.value}.toggle`}
                    className={`rounded-lg border-2 py-2 text-xs font-semibold transition-smooth ${
                      form.furnishingType === ft.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-muted text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {ft.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Location */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="city"
                className="mb-1 block text-sm font-semibold"
              >
                City
              </Label>
              <Input
                id="city"
                placeholder="e.g. Bhubaneswar"
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                data-ocid="owner_property_new.city.input"
              />
            </div>
            <div>
              <Label
                htmlFor="address"
                className="mb-1 block text-sm font-semibold"
              >
                Full Address
              </Label>
              <Textarea
                id="address"
                placeholder="Street, locality, landmark..."
                rows={3}
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                data-ocid="owner_property_new.address.textarea"
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              📍 Our executive will physically verify the location during the
              approval process.
            </div>
          </div>
        )}

        {/* Step 2 — Description */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="desc"
                className="mb-1 block text-sm font-semibold"
              >
                Property Description
              </Label>
              <Textarea
                id="desc"
                placeholder="Describe your property — size, nearby facilities, unique features..."
                rows={6}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                data-ocid="owner_property_new.description.textarea"
              />
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {form.description.length} chars
              </p>
            </div>
          </div>
        )}

        {/* Step 3 — Photos */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-semibold">
                Upload Photos (max 6)
              </Label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                data-ocid="owner_property_new.upload_button"
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 py-8 transition-smooth hover:border-primary/50 hover:bg-primary/5"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Tap to upload photos
                </span>
                <span className="text-xs text-muted-foreground">
                  JPG, PNG, WEBP • Max 6 photos
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                data-ocid="owner_property_new.dropzone"
              />
            </div>

            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoPreviews.map((src, i) => (
                  <div
                    key={src}
                    className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                  >
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(i)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-background"
                      aria-label="Remove photo"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              📸 Our executive will also take verified photos during the
              inspection.
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-5 flex gap-3">
        {step > 0 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            className="flex-1"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
            data-ocid="owner_property_new.next_button"
          >
            Next <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            className="flex-1"
            disabled={mutation.isPending || !ready}
            onClick={() => mutation.mutate()}
            data-ocid="owner_property_new.submit_button"
          >
            {mutation.isPending ? "Submitting..." : "Submit Property"}
          </Button>
        )}
      </div>

      {mutation.isSuccess && (
        <p
          className="mt-3 text-center text-sm text-emerald-600"
          data-ocid="owner_property_new.success_state"
        >
          ✅ Property submitted! Pending XOLEN verification.
        </p>
      )}
    </div>
  );
}
