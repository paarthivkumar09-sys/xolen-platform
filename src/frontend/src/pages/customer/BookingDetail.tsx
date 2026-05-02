import { XolenBadge } from "@/components/shared/XolenBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { DecisionStatus, PaymentStatus, PropertyStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Clock,
  MapPin,
  RefreshCcw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function fmt(n: bigint): string {
  return `\u20b9${Number(n).toLocaleString("en-IN")}`;
}

function formatDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function useCountdown(deadlineNs: bigint | undefined): string {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!deadlineNs) return;
    const tick = () => {
      const nowMs = Date.now();
      const deadlineMs = Number(deadlineNs) / 1_000_000;
      const diff = deadlineMs - nowMs;
      if (diff <= 0) {
        setRemaining("00:00");
        return;
      }
      const mins = Math.floor(diff / 60_000);
      const secs = Math.floor((diff % 60_000) / 1_000);
      setRemaining(
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`,
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadlineNs]);

  return remaining;
}

export default function BookingDetail() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { actor, ready } = useBackend();
  const queryClient = useQueryClient();

  const { data: booking, isLoading: bookingLoading } = useQuery({
    queryKey: ["booking", id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBooking(BigInt(id));
    },
    enabled: ready && !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.decisionStatus === DecisionStatus.pending) return 10_000;
      return false;
    },
  });

  const { data: property, isLoading: propLoading } = useQuery({
    queryKey: ["property", booking ? String(booking.propertyId) : ""],
    queryFn: async () => {
      if (!actor || !booking) return null;
      return actor.getProperty(booking.propertyId);
    },
    enabled: ready && !!booking,
  });

  const decisionMutation = useMutation({
    mutationFn: async (decision: DecisionStatus) => {
      if (!actor || !booking) throw new Error("Not ready");
      return actor.processDecision(booking.id, decision);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["booking", id], updated);
      if (updated.decisionStatus === DecisionStatus.accepted) {
        toast.success("Stay confirmed! Welcome home. \ud83c\udfe0");
      } else if (updated.decisionStatus === DecisionStatus.refunded) {
        toast.success("90% refund initiated. It will reflect shortly.");
      }
    },
    onError: () => {
      toast.error("Failed to process decision. Please try again.");
    },
  });

  const countdown = useCountdown(
    booking?.decisionStatus === DecisionStatus.pending
      ? booking.decisionDeadline
      : undefined,
  );

  const isLoading = bookingLoading || propLoading || !ready;

  if (isLoading) {
    return (
      <div className="space-y-4" data-ocid="booking_detail.loading_state">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-28 w-full rounded-xl" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-20"
        data-ocid="booking_detail.error_state"
      >
        <p className="text-lg font-semibold text-foreground">
          Booking not found
        </p>
        <button
          type="button"
          onClick={() => navigate({ to: "/my-bookings" })}
          className="text-primary underline"
        >
          My Bookings
        </button>
      </div>
    );
  }

  const isPending = booking.decisionStatus === DecisionStatus.pending;
  const isAccepted = booking.decisionStatus === DecisionStatus.accepted;
  const isRefunded = booking.decisionStatus === DecisionStatus.refunded;
  const isExpired = booking.decisionStatus === DecisionStatus.expired;

  const deadlineMs = Number(booking.decisionDeadline) / 1_000_000;
  const withinDeadline = isPending && Date.now() < deadlineMs;

  return (
    <div className="space-y-4 pb-8" data-ocid="booking_detail.page">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          data-ocid="booking_detail.back_button"
          onClick={() => navigate({ to: "/my-bookings" })}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/70"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">
          Booking Details
        </h1>
      </div>

      {/* Status Banner */}
      <div data-ocid="booking_detail.status_banner">
        {isAccepted && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-800">
                Your stay is confirmed! \ud83c\udfe0
              </p>
              <p className="text-xs text-emerald-700">
                Enjoy your stay. Contact support if you need help.
              </p>
            </div>
          </div>
        )}
        {isRefunded && (
          <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <RefreshCcw className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">
                90% refund processed
              </p>
              <p className="text-xs text-muted-foreground">
                Refund will reflect in 2\u20135 business days.
              </p>
            </div>
          </div>
        )}
        {isExpired && (
          <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-semibold text-foreground">
                Decision time expired
              </p>
              <p className="text-xs text-muted-foreground">
                No refund available after the decision window.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Property Info */}
      {property && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <img
              src={
                property.photos[0]?.getDirectURL() ??
                "/assets/images/placeholder.svg"
              }
              alt={property.location.address}
              className="h-16 w-16 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
            <div className="min-w-0 flex-1">
              <p className="font-display font-semibold text-foreground truncate">
                {property.location.address}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="h-3 w-3" />
                <span>{property.location.city}</span>
              </div>
              {property.status === PropertyStatus.verified && (
                <XolenBadge className="mt-1.5" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking Info */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h2 className="font-display text-sm font-semibold text-foreground">
          Booking Info
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <CalendarDays className="h-3.5 w-3.5" /> Check-in
            </div>
            <p className="font-semibold text-sm text-foreground">
              {formatDate(booking.checkIn)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 p-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
              <CalendarDays className="h-3.5 w-3.5" /> Check-out
            </div>
            <p className="font-semibold text-sm text-foreground">
              {formatDate(booking.checkOut)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-semibold text-foreground">
            {Number(booking.totalDays)} days
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Paid</span>
          <span className="font-display font-bold text-primary">
            {fmt(booking.totalPrice)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Payment</span>
          <Badge
            variant={
              booking.paymentStatus === PaymentStatus.success
                ? "default"
                : "secondary"
            }
            className={
              booking.paymentStatus === PaymentStatus.success
                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                : ""
            }
          >
            {booking.paymentStatus}
          </Badge>
        </div>
        {booking.serviceAddons.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-1">
              Add-on Services
            </p>
            <div className="flex flex-wrap gap-1.5">
              {booking.serviceAddons.map((addon) => (
                <Badge
                  key={String(addon.serviceId)}
                  variant="secondary"
                  className="text-xs"
                >
                  {addon.serviceName}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Decision Section */}
      {isPending && (
        <div
          className="rounded-xl border-2 border-primary bg-card p-4 space-y-4"
          data-ocid="booking_detail.decision_section"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-foreground">
              Make Your Decision
            </h2>
            {withinDeadline && (
              <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                <Clock className="h-4 w-4 text-primary" />
                <span
                  className="font-mono text-sm font-bold text-primary"
                  data-ocid="booking_detail.countdown"
                >
                  {countdown}
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Visit the property and decide within 30 minutes of arrival.
          </p>
          {withinDeadline ? (
            <div className="grid grid-cols-1 gap-3">
              <Button
                type="button"
                data-ocid="booking_detail.continue_stay_button"
                className="w-full rounded-xl py-5 font-display font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={decisionMutation.isPending}
                onClick={() => decisionMutation.mutate(DecisionStatus.accepted)}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                I&apos;m Happy \u2014 Continue Stay
              </Button>
              <Button
                type="button"
                variant="outline"
                data-ocid="booking_detail.refund_button"
                className="w-full rounded-xl py-5 font-display font-bold border-primary text-primary hover:bg-primary/5"
                disabled={decisionMutation.isPending}
                onClick={() => decisionMutation.mutate(DecisionStatus.refunded)}
              >
                <ThumbsDown className="mr-2 h-5 w-5" />
                Not Satisfied \u2014 Get Refund
              </Button>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/40 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                Decision time has passed. No refund available.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Extend Stay */}
      {isAccepted && (
        <div
          className="rounded-xl border border-border bg-muted/30 p-4 text-center"
          data-ocid="booking_detail.extend_section"
        >
          <p className="text-sm text-muted-foreground mb-3">
            Want to extend your stay?
          </p>
          <Button
            type="button"
            variant="outline"
            data-ocid="booking_detail.extend_button"
            className="rounded-xl border-secondary text-secondary hover:bg-secondary/5"
            onClick={() =>
              navigate({
                to: "/checkout",
                search: { propertyId: String(booking.propertyId) },
              })
            }
          >
            Extend Stay
          </Button>
        </div>
      )}
    </div>
  );
}
