import { StickyBookButton } from "@/components/shared/StickyBookButton";
import { XolenBadge } from "@/components/shared/XolenBadge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import {
  FurnishingType,
  PropertyStatus,
  PropertyType,
  TenantType,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Shield,
  Users,
  Wifi,
  Zap,
} from "lucide-react";
import { useState } from "react";

function fmt(n: bigint) {
  return `\u20b9${Number(n).toLocaleString("en-IN")}`;
}

const TYPE_LABELS: Record<string, string> = {
  [PropertyType.oneRK]: "1 RK",
  [PropertyType.oneBHK]: "1 BHK",
  [PropertyType.twoBHK]: "2 BHK",
  [PropertyType.threeBHK]: "3 BHK",
  [PropertyType.room]: "Room",
};

const TENANT_LABELS: Record<string, string> = {
  [TenantType.boys]: "Boys Only",
  [TenantType.girls]: "Girls Only",
  [TenantType.family]: "Family",
  [TenantType.all]: "All Welcome",
};

const FURNISH_LABELS: Record<string, string> = {
  [FurnishingType.furnished]: "Fully Furnished",
  [FurnishingType.semiFurnished]: "Semi-Furnished",
  [FurnishingType.unfurnished]: "Unfurnished",
};

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  AC: Zap,
  Bathroom: Bath,
};

export default function PropertyDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const [imgIndex, setImgIndex] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(BigInt(id));
    },
    enabled: ready && !!id,
  });

  const { data: availability } = useQuery({
    queryKey: ["availability", id],
    queryFn: async () => {
      if (!actor || !property) return null;
      const today = BigInt(Date.now()) * 1_000_000n;
      return actor.getPropertyAvailability(BigInt(id), today, 15n);
    },
    enabled: ready && !!property,
  });

  const handleBookNow = () => {
    navigate({ to: "/checkout", search: { propertyId: id } });
  };

  if (isLoading || !ready) {
    return (
      <div
        className="space-y-4 pb-32"
        data-ocid="property_detail.loading_state"
      >
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-20"
        data-ocid="property_detail.error_state"
      >
        <p className="text-lg font-semibold text-foreground">
          Property not found
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-primary underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const photos = property.photos.map((p) => p.getDirectURL());
  const hasPhotos = photos.length > 0;
  const currentPhoto = hasPhotos
    ? photos[imgIndex]
    : "/assets/images/placeholder.svg";
  const isVerified = property.status === PropertyStatus.verified;
  const roomsLeft = Number(property.roomsAvailable);
  const showUrgency = roomsLeft > 0 && roomsLeft <= 3;

  const availableFrom = availability?.nextAvailableFrom
    ? new Date(
        Number(availability.nextAvailableFrom) / 1_000_000,
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="pb-36" data-ocid="property_detail.page">
      {/* Back nav */}
      <button
        type="button"
        data-ocid="property_detail.back_button"
        onClick={() => navigate({ to: "/" })}
        className="mb-3 flex items-center gap-1 text-sm text-muted-foreground transition-smooth hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Image Gallery */}
      <div
        className="relative overflow-hidden rounded-xl"
        data-ocid="property_detail.gallery"
      >
        <img
          src={currentPhoto}
          alt={property.location.address}
          className="h-64 w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {showUrgency && (
          <span className="badge-urgency absolute left-3 top-3">
            Only {roomsLeft} room{roomsLeft > 1 ? "s" : ""} left
          </span>
        )}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              data-ocid="property_detail.gallery_prev"
              onClick={() =>
                setImgIndex((i) => (i - 1 + photos.length) % photos.length)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow transition-smooth hover:bg-card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              data-ocid="property_detail.gallery_next"
              onClick={() => setImgIndex((i) => (i + 1) % photos.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 shadow transition-smooth hover:bg-card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {photos.map((_, i) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: gallery dot
                  key={i}
                  type="button"
                  data-ocid={`property_detail.gallery_dot.${i + 1}`}
                  onClick={() => setImgIndex(i)}
                  className={`h-1.5 rounded-full transition-smooth ${
                    i === imgIndex ? "w-4 bg-primary" : "w-1.5 bg-card/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Title + Badges */}
      <div className="mt-4 space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="font-display text-xl font-bold text-foreground leading-tight min-w-0">
            {property.location.address}
          </h1>
          {isVerified && <XolenBadge size="md" />}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span>{property.location.city}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full">
            {TYPE_LABELS[property.propertyType] ?? property.propertyType}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {TENANT_LABELS[property.tenantType] ?? property.tenantType}
          </Badge>
          <Badge variant="outline" className="rounded-full">
            {FURNISH_LABELS[property.furnishingType] ?? property.furnishingType}
          </Badge>
        </div>
      </div>

      {/* Price Card */}
      <div className="mt-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-display text-3xl font-bold text-primary">
              {fmt(property.perDayPrice)}
            </span>
            <span className="ml-1 text-sm text-muted-foreground">/day</span>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Monthly rent</p>
            <p className="font-semibold text-foreground">
              {fmt(property.monthlyRent)}
            </p>
          </div>
        </div>
        {availability && (
          <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-sm">
            {availability.available ? (
              <span className="font-medium text-emerald-700">
                \u2713 Available now
              </span>
            ) : (
              <span className="text-muted-foreground">
                Next available from{" "}
                <span className="font-semibold text-foreground">
                  {availableFrom ?? "\u2014"}
                </span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Refund Trust Banner */}
      <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-emerald-800">
            Not satisfied? Get 90% refund
          </p>
          <p className="text-xs text-emerald-700">
            Visit the property after booking. Decide within 30 minutes. If not
            happy, get 90% back instantly.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <Users className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-xs text-muted-foreground">Max Guests</p>
          <p className="font-display text-lg font-bold text-foreground">
            {Number(property.maxGuests)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-3 text-center">
          <BedDouble className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-xs text-muted-foreground">Rooms Available</p>
          <p className="font-display text-lg font-bold text-foreground">
            {Number(property.roomsAvailable)}/{Number(property.totalRooms)}
          </p>
        </div>
      </div>

      {/* Description */}
      {property.description && (
        <div className="mt-4">
          <h2 className="mb-2 font-display text-base font-semibold text-foreground">
            About this place
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {property.description}
          </p>
        </div>
      )}

      {/* Amenities */}
      {property.amenities.length > 0 && (
        <div className="mt-4">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">
            Amenities
          </h2>
          <div
            className="grid grid-cols-2 gap-2"
            data-ocid="property_detail.amenities"
          >
            {property.amenities.map((amenity) => {
              const Icon = AMENITY_ICONS[amenity] ?? Zap;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {amenity}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tenant Rules */}
      <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
        <h2 className="mb-2 font-display text-base font-semibold text-foreground">
          House Rules
        </h2>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            \u2022 Suitable for:{" "}
            <span className="font-medium text-foreground">
              {TENANT_LABELS[property.tenantType]}
            </span>
          </li>
          <li>
            \u2022 Furnishing:{" "}
            <span className="font-medium text-foreground">
              {FURNISH_LABELS[property.furnishingType]}
            </span>
          </li>
          <li>
            \u2022 Minimum stay:{" "}
            <span className="font-medium text-foreground">15 days</span>
          </li>
          <li>\u2022 Advance payment required</li>
        </ul>
      </div>

      <StickyBookButton
        label="Book Now"
        onClick={handleBookNow}
        price={`${fmt(property.perDayPrice)}/day`}
      />
    </div>
  );
}
