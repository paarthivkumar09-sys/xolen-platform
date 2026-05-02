import { createActor } from "@/backend";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Property, PropertyFilter } from "@/types";
import { PropertyType, TenantType } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import {
  Building2,
  ChevronDown,
  Filter,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const PROP_TYPES: Array<{ value: PropertyType | ""; label: string }> = [
  { value: "", label: "All" },
  { value: PropertyType.oneRK, label: "1 RK" },
  { value: PropertyType.oneBHK, label: "1 BHK" },
  { value: PropertyType.twoBHK, label: "2 BHK" },
  { value: PropertyType.threeBHK, label: "3 BHK" },
  { value: PropertyType.room, label: "Room" },
];

const TENANT_TYPES: Array<{ value: TenantType | ""; label: string }> = [
  { value: "", label: "All Guests" },
  { value: TenantType.boys, label: "Boys" },
  { value: TenantType.girls, label: "Girls" },
  { value: TenantType.family, label: "Family" },
  { value: TenantType.all, label: "Mixed" },
];

const PRICE_PRESETS = [
  { label: "Any", min: 0, max: 0 },
  { label: "Under ₹500/day", min: 0, max: 500 },
  { label: "₹500–₹1000", min: 500, max: 1000 },
  { label: "₹1000–₹2000", min: 1000, max: 2000 },
  { label: "₹2000+", min: 2000, max: 0 },
];

// biome-ignore lint/correctness/noUnusedVariables: may be needed later
function formatNextAvailable(ts: bigint): string {
  const date = new Date(Number(ts) / 1_000_000);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface FilterState {
  city: string;
  propType: PropertyType | "";
  tenant: TenantType | "";
  pricePreset: number;
}

export default function CustomerSearch() {
  const routeSearch = useSearch({ strict: false }) as { city?: string };
  const { actor, isFetching } = useActor(createActor);

  const [filterState, setFilterState] = useState<FilterState>({
    city: routeSearch.city ?? "Bhubaneswar",
    propType: "",
    tenant: "",
    pricePreset: 0,
  });
  const [cityInput, setCityInput] = useState(routeSearch.city ?? "Bhubaneswar");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync city from route params on mount
  useEffect(() => {
    if (routeSearch.city) {
      setFilterState((s) => ({ ...s, city: routeSearch.city ?? s.city }));
      setCityInput(routeSearch.city);
    }
  }, [routeSearch.city]);

  const preset = PRICE_PRESETS[filterState.pricePreset];
  const filter: PropertyFilter = {
    ...(filterState.city ? { city: filterState.city } : {}),
    ...(filterState.propType ? { propertyType: filterState.propType } : {}),
    ...(filterState.tenant ? { tenantType: filterState.tenant } : {}),
    ...(preset.min > 0 ? { minPrice: BigInt(preset.min) } : {}),
    ...(preset.max > 0 ? { maxPrice: BigInt(preset.max) } : {}),
  };

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["search", filter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(Object.keys(filter).length ? filter : null);
    },
    enabled: !!actor && !isFetching,
  });

  const results = properties?.filter((p) => p.status === "verified") ?? [];

  const activeFilterCount = [
    filterState.propType !== "",
    filterState.tenant !== "",
    filterState.pricePreset !== 0,
  ].filter(Boolean).length;

  function applyCity() {
    setFilterState((s) => ({ ...s, city: cityInput }));
  }

  function clearFilters() {
    setFilterState((s) => ({
      ...s,
      propType: "",
      tenant: "",
      pricePreset: 0,
    }));
  }

  return (
    <div className="space-y-4 pb-4">
      {/* Search header */}
      <div className="space-y-2">
        <h1 className="font-display text-xl font-bold text-foreground">
          Search Stays
        </h1>

        {/* City + filter row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <Input
              data-ocid="search.city_input"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyCity()}
              placeholder="City or area..."
              className="rounded-xl pl-9"
            />
          </div>
          <Button
            type="button"
            data-ocid="search.submit_button"
            onClick={applyCity}
            className="rounded-xl px-3"
          >
            <Search className="h-4 w-4" />
          </Button>
          <button
            type="button"
            data-ocid="search.filter_button"
            onClick={() => setDrawerOpen(true)}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-smooth ${
              activeFilterCount > 0
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40"
            }`}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Property type pills (quick filter) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PROP_TYPES.map(({ value, label }) => (
            <button
              key={value || "all"}
              type="button"
              data-ocid={`search.type_${label.replace(" ", "_").toLowerCase()}_filter`}
              onClick={() => setFilterState((s) => ({ ...s, propType: value }))}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-smooth ${
                filterState.propType === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? (
            <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <>
              <span className="font-semibold text-foreground">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "property" : "properties"} in{" "}
              <span className="font-medium text-foreground">
                {filterState.city}
              </span>
            </>
          )}
        </p>
        {activeFilterCount > 0 && (
          <button
            type="button"
            data-ocid="search.clear_filters_button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div
          className="rounded-xl border border-border bg-muted/30 py-14 text-center"
          data-ocid="search.empty_state"
        >
          <Building2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="font-display font-bold text-foreground">
            No properties found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your city or adjusting filters
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 text-sm font-medium text-primary hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => {
            const hasAvailability = p.roomsAvailable > 0n;
            return (
              <motion.div
                key={String(p.id)}
                data-ocid={`search.property.item.${i + 1}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.3) }}
              >
                <div className="relative">
                  {!hasAvailability && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-card/80 backdrop-blur-[2px]">
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                        Unavailable
                      </span>
                    </div>
                  )}
                  <PropertyCard property={p} index={i} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Filter Drawer (bottom sheet on mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              data-ocid="search.filter_drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-border bg-card px-4 pb-10 pt-4 shadow-xl"
            >
              {/* Handle */}
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-muted" />

              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-foreground" />
                  <span className="font-display font-bold text-foreground">
                    Filters
                  </span>
                </div>
                <button
                  type="button"
                  data-ocid="search.filter_close_button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/70"
                  aria-label="Close filters"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Property Type */}
              <div className="mb-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Property Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {PROP_TYPES.map(({ value, label }) => (
                    <button
                      key={value || "all"}
                      type="button"
                      data-ocid={`search.drawer_type_${label.replace(" ", "_").toLowerCase()}_filter`}
                      onClick={() =>
                        setFilterState((s) => ({ ...s, propType: value }))
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-smooth ${
                        filterState.propType === value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenant Type */}
              <div className="mb-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Suitable For
                </p>
                <div className="flex flex-wrap gap-2">
                  {TENANT_TYPES.map(({ value, label }) => (
                    <button
                      key={value || "all"}
                      type="button"
                      data-ocid={`search.drawer_tenant_${value || "all"}_filter`}
                      onClick={() =>
                        setFilterState((s) => ({ ...s, tenant: value }))
                      }
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-smooth ${
                        filterState.tenant === value
                          ? "border-secondary bg-secondary text-secondary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-secondary/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Price Range
                </p>
                <div className="space-y-2">
                  {PRICE_PRESETS.map(({ label }, idx) => (
                    <button
                      key={label}
                      type="button"
                      data-ocid={`search.drawer_price_${idx}_filter`}
                      onClick={() =>
                        setFilterState((s) => ({ ...s, pricePreset: idx }))
                      }
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-smooth ${
                        filterState.pricePreset === idx
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {label}
                      {filterState.pricePreset === idx && (
                        <ChevronDown className="h-4 w-4 rotate-[-90deg] text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  data-ocid="search.filter_clear_button"
                  onClick={clearFilters}
                  className="flex-1 rounded-xl"
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  data-ocid="search.filter_apply_button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  Show Results
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
