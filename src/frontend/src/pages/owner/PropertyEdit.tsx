import { ExternalBlob } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBackend } from "@/hooks/useBackend";
import {
  FurnishingType,
  type Property,
  type PropertyInput,
  PropertyType,
  TenantType,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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

interface EditForm {
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
  newPhotos: File[];
}

export default function PropertyEdit() {
  const navigate = useNavigate();
  const { id } = useParams({ strict: false }) as { id: string };
  const { actor, ready } = useBackend();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const { data: property, isLoading } = useQuery<Property | null>({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(BigInt(id));
    },
    enabled: ready && !!id,
  });

  const [form, setForm] = useState<EditForm>({
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
    newPhotos: [],
  });

  useEffect(() => {
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
      newPhotos: [],
    });
  }, [property]);

  const perDay = form.monthlyRent
    ? Math.ceil(Number(form.monthlyRent) / 30)
    : 0;

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const newBlobs: ExternalBlob[] = await Promise.all(
        form.newPhotos.map(async (file) => {
          const buf = new Uint8Array(await file.arrayBuffer());
          return ExternalBlob.fromBytes(buf);
        }),
      );
      const existingPhotos = property?.photos ?? [];
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
        amenities: property?.amenities ?? [],
        photos: [...existingPhotos, ...newBlobs],
      };
      return actor.updateProperty(BigInt(id), input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["owner", "properties"] });
      qc.invalidateQueries({ queryKey: ["property", id] });
      toast.success("Property updated!");
      navigate({ to: "/owner/properties" });
    },
    onError: (err) => {
      toast.error(
        `Update failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    },
  });

  function set<K extends keyof EditForm>(key: K, val: EditForm[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 6);
    const previews = newFiles.map((f) => URL.createObjectURL(f));
    setForm((prev) => ({
      ...prev,
      newPhotos: [...prev.newPhotos, ...newFiles],
    }));
    setNewPreviews((prev) => [...prev, ...previews]);
  }

  function removeNewPhoto(index: number) {
    setForm((prev) => ({
      ...prev,
      newPhotos: prev.newPhotos.filter((_, i) => i !== index),
    }));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  if (isLoading || !property) {
    return (
      <div
        className="flex min-h-64 items-center justify-center"
        data-ocid="owner_property_edit.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg" data-ocid="owner_property_edit.page">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/owner/properties" })}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80"
          data-ocid="owner_property_edit.back_button"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-bold text-foreground">
            Edit Property
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">ID #{id}</p>
            <StatusBadge status={property.status} />
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
        className="space-y-5"
      >
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-5">
          {/* Property Type */}
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
                  data-ocid={`owner_property_edit.type_${pt.label.toLowerCase()}.toggle`}
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

          {/* Rent */}
          <div>
            <Label
              htmlFor="edit-rent"
              className="mb-1 block text-sm font-semibold"
            >
              Monthly Rent (₹)
            </Label>
            <Input
              id="edit-rent"
              type="number"
              min={0}
              value={form.monthlyRent}
              onChange={(e) => set("monthlyRent", e.target.value)}
              data-ocid="owner_property_edit.monthly_rent.input"
            />
            {perDay > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                Per-day:{" "}
                <span className="font-semibold text-primary">
                  ₹{perDay}/day
                </span>
              </p>
            )}
          </div>

          {/* Guests + Rooms */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label
                htmlFor="edit-guests"
                className="mb-1 block text-sm font-semibold"
              >
                Max Guests
              </Label>
              <Input
                id="edit-guests"
                type="number"
                min={1}
                value={form.maxGuests}
                onChange={(e) => set("maxGuests", e.target.value)}
                data-ocid="owner_property_edit.max_guests.input"
              />
            </div>
            <div>
              <Label
                htmlFor="edit-rooms"
                className="mb-1 block text-sm font-semibold"
              >
                Rooms Available
              </Label>
              <Input
                id="edit-rooms"
                type="number"
                min={0}
                value={form.roomsAvailable}
                onChange={(e) => set("roomsAvailable", e.target.value)}
                data-ocid="owner_property_edit.rooms_available.input"
              />
            </div>
          </div>

          {/* Tenant Type */}
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
                    name="editTenantType"
                    value={tt.value}
                    checked={form.tenantType === tt.value}
                    onChange={() => set("tenantType", tt.value)}
                    data-ocid={`owner_property_edit.tenant_${tt.label.toLowerCase().replace(" ", "_")}.radio`}
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

          {/* Furnishing */}
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
                  data-ocid={`owner_property_edit.furnishing_${ft.value}.toggle`}
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

        {/* Location */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-foreground">
            Location
          </h2>
          <div>
            <Label
              htmlFor="edit-city"
              className="mb-1 block text-sm font-semibold"
            >
              City
            </Label>
            <Input
              id="edit-city"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              data-ocid="owner_property_edit.city.input"
            />
          </div>
          <div>
            <Label
              htmlFor="edit-address"
              className="mb-1 block text-sm font-semibold"
            >
              Address
            </Label>
            <Textarea
              id="edit-address"
              rows={3}
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              data-ocid="owner_property_edit.address.textarea"
            />
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-foreground">
            Description
          </h2>
          <Textarea
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe your property..."
            data-ocid="owner_property_edit.description.textarea"
          />
        </div>

        {/* Photos */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-foreground">
            Add New Photos
          </h2>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            data-ocid="owner_property_edit.upload_button"
            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 py-6 transition-smooth hover:border-primary/50 hover:bg-primary/5"
          >
            <Upload className="h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              Tap to upload
            </span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            data-ocid="owner_property_edit.dropzone"
          />
          {newPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {newPreviews.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={src}
                    alt={`New ${i + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(i)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground/60 text-background"
                    aria-label="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={mutation.isPending || !ready}
          data-ocid="owner_property_edit.submit_button"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>

        {mutation.isSuccess && (
          <p
            className="text-center text-sm text-emerald-600"
            data-ocid="owner_property_edit.success_state"
          >
            ✅ Property updated successfully!
          </p>
        )}
        {mutation.isError && (
          <p
            className="text-center text-sm text-destructive"
            data-ocid="owner_property_edit.error_state"
          >
            Failed to update. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
