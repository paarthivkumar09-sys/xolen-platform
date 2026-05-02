import { StatusBadge } from "@/components/shared/StatusBadge";
import { XolenBadge } from "@/components/shared/XolenBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import type { OwnerEarnings, Property } from "@/types";
import { PropertyStatus } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Building2, DollarSign, Plus, TrendingUp, Users } from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-primary",
  loading = false,
}: {
  label: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  color?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className={`rounded-lg bg-muted p-1.5 ${color}`}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-20" />
      ) : (
        <p className="font-display text-2xl font-bold text-foreground">
          {value}
        </p>
      )}
    </div>
  );
}

function PropertyRow({ property }: { property: Property }) {
  const isVerified = property.status === PropertyStatus.verified;
  const typeLabel: Record<string, string> = {
    oneRK: "1RK",
    oneBHK: "1BHK",
    twoBHK: "2BHK",
    threeBHK: "3BHK",
    room: "Room",
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {typeLabel[property.propertyType] ?? property.propertyType} —{" "}
          {property.location.city}
        </p>
        <p className="text-xs text-muted-foreground">
          ₹{Number(property.monthlyRent).toLocaleString("en-IN")}/month
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <StatusBadge status={property.status} />
        {isVerified && <XolenBadge size="sm" />}
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const { actor, ready } = useBackend();

  const { data: earnings, isLoading: earningsLoading } =
    useQuery<OwnerEarnings>({
      queryKey: ["owner", "earnings"],
      queryFn: async () => {
        if (!actor) throw new Error("Not ready");
        return actor.getOwnerEarnings();
      },
      enabled: ready,
    });

  const { data: properties = [], isLoading: propsLoading } = useQuery<
    Property[]
  >({
    queryKey: ["owner", "properties"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(null);
    },
    enabled: ready,
  });

  const pendingCount = properties.filter(
    (p) => p.status === PropertyStatus.pending,
  ).length;
  const verifiedCount = properties.filter(
    (p) => p.status === PropertyStatus.verified,
  ).length;
  const previewProps = properties.slice(0, 3);

  return (
    <div className="space-y-6" data-ocid="owner_dashboard.page">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your properties and track earnings
          </p>
        </div>
        <Link to="/owner/property/new">
          <Button
            size="sm"
            data-ocid="owner_dashboard.add_property_button"
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Property
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Properties"
          value={propsLoading ? "—" : properties.length}
          icon={Building2}
          loading={propsLoading}
        />
        <StatCard
          label="Pending Verification"
          value={propsLoading ? "—" : pendingCount}
          icon={TrendingUp}
          color="text-amber-600"
          loading={propsLoading}
        />
        <StatCard
          label="Active Bookings"
          value={earningsLoading ? "—" : Number(earnings?.activeBookings ?? 0)}
          icon={Users}
          color="text-secondary"
          loading={earningsLoading}
        />
        <StatCard
          label="Total Earned"
          value={
            earningsLoading
              ? "—"
              : `₹${Number(earnings?.totalEarned ?? 0).toLocaleString("en-IN")}`
          }
          icon={DollarSign}
          color="text-primary"
          loading={earningsLoading}
        />
      </div>

      {/* My Properties preview */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display font-semibold text-foreground">
            My Properties
          </h2>
          <Link
            to="/owner/properties"
            data-ocid="owner_dashboard.view_all_link"
            className="text-xs font-medium text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        {propsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : previewProps.length === 0 ? (
          <div
            className="flex flex-col items-center gap-3 py-8 text-center"
            data-ocid="owner_dashboard.empty_state"
          >
            <Building2 className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No properties yet.</p>
            <Link to="/owner/property/new">
              <Button
                variant="outline"
                size="sm"
                data-ocid="owner_dashboard.add_first_property_button"
              >
                Add your first property
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {previewProps.map((property, i) => (
              <div
                key={String(property.id)}
                data-ocid={`owner_dashboard.property_item.${i + 1}`}
              >
                <PropertyRow property={property} />
              </div>
            ))}
            {properties.length > 3 && (
              <p className="pt-1 text-center text-xs text-muted-foreground">
                +{properties.length - 3} more •{" "}
                <Link
                  to="/owner/properties"
                  className="text-primary hover:underline"
                >
                  View all
                </Link>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick summary */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <h2 className="mb-3 font-display font-semibold text-foreground">
          Quick Summary
        </h2>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">
              {verifiedCount} Verified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">
              {pendingCount} Pending review
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-muted-foreground">
              {Number(earnings?.activeBookings ?? 0)} Active stays
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
