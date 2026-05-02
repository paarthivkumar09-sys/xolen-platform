import { StatusBadge } from "@/components/shared/StatusBadge";
import { XolenBadge } from "@/components/shared/XolenBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { type Property, PropertyStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Building2, Edit, Plus } from "lucide-react";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  oneRK: "1RK",
  oneBHK: "1BHK",
  twoBHK: "2BHK",
  threeBHK: "3BHK",
  room: "Room",
};

const FILTERS = [
  { label: "All", value: "" },
  { label: "Pending", value: PropertyStatus.pending },
  { label: "Verified", value: PropertyStatus.verified },
  { label: "Assigned", value: PropertyStatus.assigned },
  { label: "Rejected", value: PropertyStatus.rejected },
];

function PropertyListCard({
  property,
  index,
}: { property: Property; index: number }) {
  const isVerified = property.status === PropertyStatus.verified;
  const perDay = Math.ceil(Number(property.monthlyRent) / 30);
  return (
    <div
      className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm transition-smooth hover:shadow-md"
      data-ocid={`owner_properties.item.${index}`}
    >
      {/* Thumb */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-20 sm:w-20">
        <Building2 className="h-7 w-7 sm:h-8 sm:w-8" />
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-display text-sm font-bold text-foreground">
            {TYPE_LABELS[property.propertyType] ?? property.propertyType}
          </span>
          <span className="text-xs text-muted-foreground">
            — {property.location.city}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {property.location.address}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <span className="font-semibold text-sm text-primary">
            ₹{perDay}/day
          </span>
          <span className="text-xs text-muted-foreground">
            (₹{Number(property.monthlyRent).toLocaleString("en-IN")}/mo)
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <StatusBadge status={property.status} />
          {isVerified && <XolenBadge size="sm" />}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-end justify-between">
        <Link
          to="/owner/property/$id/edit"
          params={{ id: String(property.id) }}
        >
          <Button
            variant="outline"
            size="sm"
            data-ocid={`owner_properties.edit_button.${index}`}
            className="gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" /> Edit
          </Button>
        </Link>
        <span className="text-xs text-muted-foreground">
          {Number(property.roomsAvailable)} rooms left
        </span>
      </div>
    </div>
  );
}

export default function OwnerProperties() {
  const { actor, ready } = useBackend();
  const [filter, setFilter] = useState("");

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["owner", "properties"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(null);
    },
    enabled: ready,
  });

  const filtered = filter
    ? properties.filter((p) => p.status === filter)
    : properties;

  return (
    <div className="space-y-5" data-ocid="owner_properties.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            My Properties
          </h1>
          <p className="text-sm text-muted-foreground">
            {properties.length} propert{properties.length === 1 ? "y" : "ies"}{" "}
            total
          </p>
        </div>
        <Link to="/owner/property/new">
          <Button
            size="sm"
            data-ocid="owner_properties.add_button"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Filter properties"
      >
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            onClick={() => setFilter(f.value)}
            data-ocid={`owner_properties.filter_${f.label.toLowerCase()}.tab`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-smooth ${
              filter === f.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center gap-4 py-16 text-center"
          data-ocid="owner_properties.empty_state"
        >
          <Building2 className="h-12 w-12 text-muted-foreground" />
          <div>
            <p className="font-display font-semibold text-foreground">
              No properties found
            </p>
            <p className="text-sm text-muted-foreground">
              {filter
                ? "Try a different filter"
                : "Add your first property to get started"}
            </p>
          </div>
          {!filter && (
            <Link to="/owner/property/new">
              <Button
                data-ocid="owner_properties.add_first_property_button"
                className="gap-2"
              >
                <Plus className="h-4 w-4" /> Add your first property
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <PropertyListCard key={String(p.id)} property={p} index={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
