import { Badge } from "@/components/ui/badge";
import type { Booking } from "@/types";
import { DecisionStatus, PaymentStatus } from "@/types";
import { Link } from "@tanstack/react-router";
import { Calendar, Home } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  index?: number;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BookingCard({ booking, index = 0 }: BookingCardProps) {
  const isActive =
    booking.decisionStatus === DecisionStatus.accepted &&
    booking.paymentStatus === PaymentStatus.success;
  const daysLeft = Math.max(
    0,
    Math.floor(
      (Number(booking.checkOut) / 1_000_000 - Date.now()) /
        (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <Link
      to="/booking/$id"
      params={{ id: String(booking.id) }}
      data-ocid={`booking_card.item.${index + 1}`}
      className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-smooth hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Home className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              Booking #{String(booking.id)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Number(booking.totalDays)} days stay
            </p>
          </div>
        </div>
        <StatusBadge status={booking.decisionStatus} />
      </div>
      <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {formatDate(booking.checkIn)}
        </span>
        <span>→</span>
        <span>{formatDate(booking.checkOut)}</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-display font-bold text-foreground">
          ₹{Number(booking.totalPrice).toLocaleString("en-IN")}
        </span>
        <div className="flex items-center gap-2">
          {isActive && (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px]"
            >
              {daysLeft}d left
            </Badge>
          )}
          <StatusBadge status={booking.paymentStatus} />
        </div>
      </div>
    </Link>
  );
}
