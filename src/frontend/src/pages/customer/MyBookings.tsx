import { createActor } from "@/backend";
import { BookingCard } from "@/components/shared/BookingCard";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Booking } from "@/types";
import { DecisionStatus, PaymentStatus } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bookmark, CalendarPlus } from "lucide-react";
import { useState } from "react";

type TabKey = "active" | "completed" | "cancelled";

const TABS: { key: TabKey; label: string }[] = [
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

function classifyBooking(b: Booking): TabKey {
  if (b.decisionStatus === DecisionStatus.refunded) return "cancelled";
  if (b.decisionStatus === DecisionStatus.expired) return "cancelled";
  if (
    b.decisionStatus === DecisionStatus.accepted &&
    b.paymentStatus === PaymentStatus.success
  ) {
    const now = Date.now();
    const checkOut = Number(b.checkOut) / 1_000_000;
    return checkOut > now ? "active" : "completed";
  }
  if (b.paymentStatus === PaymentStatus.failed) return "cancelled";
  if (b.decisionStatus === DecisionStatus.pending) return "active";
  return "completed";
}

function BookingSkeletonItem() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-3 flex gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-7 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [tab, setTab] = useState<TabKey>("active");
  const { actor, isFetching } = useActor(createActor);

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["myBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });

  const categorised = bookings ?? [];
  const counts: Record<TabKey, number> = {
    active: categorised.filter((b) => classifyBooking(b) === "active").length,
    completed: categorised.filter((b) => classifyBooking(b) === "completed")
      .length,
    cancelled: categorised.filter((b) => classifyBooking(b) === "cancelled")
      .length,
  };
  const filtered = categorised.filter((b) => classifyBooking(b) === tab);

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <h1 className="font-display text-xl font-bold">My Trips</h1>
          {counts.active > 0 && (
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary text-[11px]"
            >
              {counts.active} active
            </Badge>
          )}
        </div>

        {/* Tabs */}
        <div
          className="flex gap-1 rounded-xl bg-muted p-1"
          data-ocid="my_bookings.filter.tab"
        >
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              data-ocid={`my_bookings.${key}_tab`}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-smooth ${
                tab === key
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              {!isLoading && counts[key] > 0 && (
                <span
                  className={`ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                    tab === key
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted-foreground/20 text-muted-foreground"
                  }`}
                >
                  {counts[key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <BookingSkeletonItem key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center py-16 text-center"
            data-ocid="my_bookings.empty_state"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-display font-bold text-foreground">
              {tab === "active"
                ? "No active trips"
                : tab === "completed"
                  ? "No completed trips"
                  : "No cancelled bookings"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "active"
                ? "Book a verified stay near you"
                : "Your trip history will appear here"}
            </p>
            {tab === "active" && (
              <Link
                to="/"
                data-ocid="my_bookings.explore_link"
                className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-smooth hover:bg-primary/90"
              >
                Explore Stays
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => (
              <div key={String(b.id)} className="space-y-2">
                <BookingCard booking={b} index={i} />
                {tab === "active" && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full">
                        <button
                          type="button"
                          disabled
                          data-ocid={`my_bookings.extend_stay_button.${i + 1}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 py-2.5 text-sm font-medium text-muted-foreground cursor-not-allowed"
                          aria-disabled="true"
                        >
                          <CalendarPlus className="h-4 w-4" />
                          Extend Stay
                        </button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Coming soon — stay extension feature
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
