import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import type { OwnerEarnings } from "@/types";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowDownLeft,
  Clock,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const MOCK_HISTORY = [
  {
    label: "Booking #1042 — Flat 3B, Bhubaneswar",
    amount: 4200,
    date: "Apr 28, 2026",
    status: "Paid",
  },
  {
    label: "Booking #1031 — Flat 3B, Bhubaneswar",
    amount: 8400,
    date: "Apr 13, 2026",
    status: "Paid",
  },
  {
    label: "Booking #1018 — Flat 3B, Bhubaneswar",
    amount: 6300,
    date: "Mar 30, 2026",
    status: "Paid",
  },
  {
    label: "Booking #1007 — Flat 3B, Bhubaneswar",
    amount: 2100,
    date: "Mar 15, 2026",
    status: "Paid",
  },
];

function EarningStatCard({
  label,
  value,
  subtext,
  icon: Icon,
  highlight = false,
  loading = false,
}: {
  label: string;
  value: string;
  subtext?: string;
  icon: React.FC<{ className?: string }>;
  highlight?: boolean;
  loading?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 shadow-sm ${
        highlight ? "border-primary/30 bg-primary/5" : "border-border bg-card"
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={`rounded-lg p-1.5 ${
            highlight
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-28" />
      ) : (
        <p
          className={`font-display text-2xl font-bold ${
            highlight ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </p>
      )}
      {subtext && !loading && (
        <p className="mt-1 text-xs text-muted-foreground">{subtext}</p>
      )}
    </div>
  );
}

export default function OwnerEarningsPage() {
  const { actor, ready } = useBackend();

  const { data: earnings, isLoading } = useQuery<OwnerEarnings>({
    queryKey: ["owner", "earnings"],
    queryFn: async () => {
      if (!actor) throw new Error("Not ready");
      return actor.getOwnerEarnings();
    },
    enabled: ready,
  });

  const totalEarned = Number(earnings?.totalEarned ?? 0);
  const pendingPayout = Number(earnings?.pendingPayout ?? 0);
  const totalBookings = Number(earnings?.totalBookings ?? 0);
  const activeBookings = Number(earnings?.activeBookings ?? 0);

  return (
    <div className="space-y-6" data-ocid="owner_earnings.page">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">
          Earnings
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your income and payouts
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <EarningStatCard
          label="Total Earned"
          value={`₹${totalEarned.toLocaleString("en-IN")}`}
          icon={DollarSign}
          highlight
          loading={isLoading}
        />
        <EarningStatCard
          label="Pending Payout"
          value={`₹${pendingPayout.toLocaleString("en-IN")}`}
          subtext="Held for 24h"
          icon={Clock}
          loading={isLoading}
        />
        <EarningStatCard
          label="Total Bookings"
          value={String(totalBookings)}
          icon={TrendingUp}
          loading={isLoading}
        />
        <EarningStatCard
          label="Active Stays"
          value={String(activeBookings)}
          icon={ArrowDownLeft}
          loading={isLoading}
        />
      </div>

      {/* Payout info */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Payout Schedule
            </p>
            <p className="mt-1 text-xs text-amber-700 leading-relaxed">
              Earnings are held for <strong>24 hours</strong> after booking
              confirmation, then automatically released to your registered bank
              account or UPI. This hold ensures the customer decision window
              (visit + accept/refund) has passed.
            </p>
          </div>
        </div>
      </div>

      {/* Earnings history */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h2 className="mb-4 font-display font-semibold text-foreground">
          Earnings History
        </h2>
        <div className="space-y-3">
          {MOCK_HISTORY.map((entry, i) => (
            <div
              key={entry.label}
              className="flex items-center justify-between rounded-lg bg-muted/30 p-3"
              data-ocid={`owner_earnings.history_item.${i + 1}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.label}
                </p>
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              </div>
              <div className="ml-3 flex flex-col items-end">
                <span className="font-semibold text-sm text-primary">
                  +₹{entry.amount.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-emerald-600 font-medium">
                  {entry.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Showing recent 4 transactions
        </p>
      </div>
    </div>
  );
}
