import { createActor } from "@/backend";
import { PropertyCard } from "@/components/shared/PropertyCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { XolenBadge } from "@/components/shared/XolenBadge";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  Locate,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const CITIES = ["Bhubaneswar", "Cuttack", "Puri", "Rourkela", "Sambalpur"];

const PSYCHOLOGY_LABELS: Array<{
  label: string;
  color: string;
  textColor: string;
}> = [
  {
    label: "Most booked",
    color: "bg-secondary/10",
    textColor: "text-secondary",
  },
  { label: "Recommended", color: "bg-primary/10", textColor: "text-primary" },
  { label: "Top rated", color: "bg-emerald-50", textColor: "text-emerald-700" },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "1",
    title: "Book a Stay",
    desc: "Choose a verified property, pick your dates (min 15 days), and pay securely online.",
  },
  {
    icon: ShieldCheck,
    step: "2",
    title: "Visit & Inspect",
    desc: "An executive will meet you at the property. Take 15–30 minutes to explore.",
  },
  {
    icon: RefreshCw,
    step: "3",
    title: "Decide Instantly",
    desc: "Love it? Move in. Not satisfied? Get 90% refund instantly — no questions asked.",
  },
];

function useFeaturedProperties() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Property[]>({
    queryKey: ["properties", "home"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(null);
    },
    enabled: !!actor && !isFetching,
  });
}

export default function Home() {
  const navigate = useNavigate();
  const { data: properties, isLoading } = useFeaturedProperties();
  const [city, setCity] = useState("Bhubaneswar");
  const [searchInput, setSearchInput] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const cityRef = useRef<HTMLDivElement>(null);

  const verified = properties?.filter((p) => p.status === "verified") ?? [];
  const featured = verified.slice(0, 6);

  function handleSearch() {
    navigate({
      to: "/search",
      search: { city: searchInput || city },
    });
  }

  function handleDetectLocation() {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setCity("Bhubaneswar");
        setDetectingLocation(false);
      },
      () => setDetectingLocation(false),
      { timeout: 8000 },
    );
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-8 pb-4">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="-mx-4 bg-gradient-to-b from-primary/8 to-transparent px-4 pb-6 pt-4"
        data-ocid="home.hero_section"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="font-display text-2xl font-extrabold tracking-tight">
            <span className="text-primary">X</span>OLEN
          </span>
          <XolenBadge size="sm" className="ml-1" />
        </div>
        <h1 className="font-display text-[22px] font-bold leading-snug text-foreground">
          Flexible stays with{" "}
          <span className="text-primary">instant refund</span> guarantee
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Book, visit, decide — 90% refund if not satisfied
        </p>

        {/* Location + Search */}
        <div className="mt-4 space-y-2">
          {/* City selector */}
          <div ref={cityRef} className="relative">
            {/* biome-ignore lint/a11y/useSemanticElements: interactive div with full keyboard support */}
            <div
              role="button"
              tabIndex={0}
              data-ocid="home.city_selector"
              onKeyDown={(e) =>
                e.key === "Enter" && setCityDropdownOpen((o) => !o)
              }
              onClick={() => setCityDropdownOpen((o) => !o)}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm transition-smooth hover:border-primary/40"
            >
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="flex-1 text-sm font-medium text-foreground">
                {city}
              </span>
              <button
                type="button"
                aria-label="Detect my location"
                data-ocid="home.detect_location_button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDetectLocation();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted transition-smooth hover:bg-primary/10"
              >
                <Locate
                  className={`h-3.5 w-3.5 ${
                    detectingLocation
                      ? "animate-spin text-primary"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            </div>
            {cityDropdownOpen && (
              <div
                className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-md"
                data-ocid="home.city_dropdown"
              >
                {CITIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCity(c);
                      setCityDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm transition-smooth hover:bg-muted ${
                      city === c
                        ? "font-semibold text-primary"
                        : "text-foreground"
                    }`}
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {c}
                    {city === c && (
                      <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                data-ocid="home.search_input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search by area, landmark..."
                className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder-muted-foreground outline-none transition-smooth focus:border-primary focus:ring-1 focus:ring-primary/30"
              />
            </div>
            <Button
              type="button"
              data-ocid="home.search_button"
              onClick={handleSearch}
              className="rounded-xl px-4"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Refund guarantee banner */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
        data-ocid="home.refund_banner"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <RefreshCw className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-sm font-bold text-emerald-800">
            90% Refund Guarantee
          </p>
          <p className="text-xs text-emerald-700">
            Not satisfied after your visit? Get instant refund.
          </p>
        </div>
        <ThumbsUp className="h-4 w-4 shrink-0 text-emerald-600" />
      </motion.div>

      {/* Featured properties */}
      <section data-ocid="home.featured_section">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Featured Stays
          </h2>
          <button
            type="button"
            data-ocid="home.view_all_button"
            onClick={() => navigate({ to: "/search", search: { city } })}
            className="flex items-center gap-1 text-sm font-medium text-primary transition-smooth hover:underline"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div
            className="rounded-xl border border-border bg-muted/30 py-10 text-center"
            data-ocid="home.empty_state"
          >
            <Star className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="font-semibold text-foreground">No properties yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              More properties being verified daily
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {featured.map((p, i) => {
              const psychLabel =
                PSYCHOLOGY_LABELS[i % PSYCHOLOGY_LABELS.length];
              return (
                <motion.div
                  key={String(p.id)}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="relative">
                    {i < 3 && (
                      <span
                        className={`absolute left-2 top-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          psychLabel.color
                        } ${psychLabel.textColor} ring-1 ring-current/20`}
                      >
                        {psychLabel.label}
                      </span>
                    )}
                    <PropertyCard property={p} index={i} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* How it works */}
      <section
        className="-mx-4 bg-muted/40 px-4 py-6"
        data-ocid="home.how_it_works_section"
      >
        <h2 className="mb-4 font-display text-lg font-bold text-foreground">
          How XOLEN works
        </h2>
        <div className="space-y-4">
          {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground">
                  <span className="mr-1.5 text-xs font-bold text-muted-foreground">
                    {step}.
                  </span>
                  {title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <Button
          type="button"
          data-ocid="home.start_search_button"
          className="mt-5 w-full rounded-xl"
          onClick={() => navigate({ to: "/search", search: { city } })}
        >
          Find a Stay in {city}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </section>
    </div>
  );
}
