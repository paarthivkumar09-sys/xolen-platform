import type { Property } from "@/types";
import { PropertyStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Users } from "lucide-react";
import { XolenBadge } from "./XolenBadge";

interface PropertyCardProps {
  property: Property;
  index?: number;
}

function formatPrice(price: bigint): string {
  return `₹${Number(price).toLocaleString("en-IN")}`;
}

const URGENCY_LABELS = [
  "Only 1 room left",
  "Only 2 rooms left",
  "Only 3 rooms left",
];

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const photoUrl =
    property.photos[0]?.getDirectURL() ?? "/assets/images/placeholder.svg";
  const isVerified = property.status === PropertyStatus.verified;
  const roomsLeft = Number(property.roomsAvailable);
  const showUrgency = roomsLeft > 0 && roomsLeft <= 3;
  const urgencyLabel =
    roomsLeft >= 1 && roomsLeft <= 3 ? URGENCY_LABELS[roomsLeft - 1] : null;

  return (
    <Link
      to="/property/$id"
      params={{ id: String(property.id) }}
      data-ocid={`property_card.item.${index + 1}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-smooth hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden">
        <img
          src={photoUrl}
          alt={property.location.address}
          className="h-44 w-full object-cover transition-smooth group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        {showUrgency && urgencyLabel && (
          <span className="badge-urgency absolute right-2 top-2">
            {urgencyLabel}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="truncate font-display text-sm font-semibold text-foreground">
          {property.location.address}
        </p>
        <div className="mt-1 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate text-xs">{property.location.city}</span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-base font-bold text-foreground">
            {formatPrice(property.perDayPrice)}
            <span className="text-xs font-normal text-muted-foreground">
              /day
            </span>
          </span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{Number(property.maxGuests)}</span>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {isVerified && <XolenBadge />}
          {roomsLeft > 0 && !showUrgency && (
            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {roomsLeft} rooms
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
