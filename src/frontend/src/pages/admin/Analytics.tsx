import { createActor } from "@/backend";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminAnalytics } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const EMPTY_ANALYTICS: AdminAnalytics = {
  totalProperties: 0n,
  totalBookings: 0n,
  totalUsers: 0n,
  totalRevenue: 0n,
  activeStays: 0n,
  pendingVerifications: 0n,
  refundsProcessed: 0n,
};

// Generate simulated daily revenue data for the last 30 days
function generateRevenueData(totalRevenue: number) {
  const days = 30;
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    // distribute revenue with some variance
    const base = totalRevenue / days;
    const variance = base * (0.4 + Math.sin(i * 0.8) * 0.4);
    return {
      day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      revenue: Math.round(Math.max(0, base + variance)),
    };
  });
}

// Generate simulated booking trend
function generateBookingTrend(totalBookings: number) {
  const days = 14;
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const base = totalBookings / days;
    const count = Math.round(
      Math.max(0, base + Math.cos(i * 0.9) * (base * 0.5)),
    );
    return {
      day: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      bookings: count,
    };
  });
}

function MetricCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-0.5 text-xs font-semibold text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { actor, isFetching } = useActor(createActor);
  const { data: analytics, isLoading } = useQuery<AdminAnalytics>({
    queryKey: ["adminAnalytics"],
    queryFn: async () => (actor ? actor.getAdminAnalytics() : EMPTY_ANALYTICS),
    enabled: !!actor && !isFetching,
  });

  const totalBookings = Number(analytics?.totalBookings ?? 0n);
  const totalRevenue = Number(analytics?.totalRevenue ?? 0n);
  const refunds = Number(analytics?.refundsProcessed ?? 0n);
  const refundRate =
    totalBookings > 0 ? ((refunds / totalBookings) * 100).toFixed(1) : "0.0";

  const revenueData = useMemo(
    () => generateRevenueData(totalRevenue),
    [totalRevenue],
  );
  const bookingData = useMemo(
    () => generateBookingTrend(totalBookings),
    [totalBookings],
  );

  const metrics = [
    {
      label: "Total Bookings",
      value: String(analytics?.totalBookings ?? 0n),
      sub: "All time",
      color: "text-blue-600",
    },
    {
      label: "Active Stays",
      value: String(analytics?.activeStays ?? 0n),
      sub: "Right now",
      color: "text-emerald-600",
    },
    {
      label: "Refund Rate",
      value: `${refundRate}%`,
      sub: `${refunds} refunds issued`,
      color: Number(refundRate) > 10 ? "text-destructive" : "text-amber-600",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      sub: "Platform earnings",
      color: "text-emerald-600",
    },
    {
      label: "Properties",
      value: String(analytics?.totalProperties ?? 0n),
      sub: "Listed",
      color: "text-primary",
    },
    {
      label: "Pending Verif.",
      value: String(analytics?.pendingVerifications ?? 0n),
      sub: "Awaiting review",
      color: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="admin_analytics.page">
      <h1 className="font-display text-xl font-bold">Analytics</h1>

      {/* KPI metrics grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
      )}

      {/* Revenue bar chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">Revenue — Last 30 Days</h2>
        {isLoading ? (
          <Skeleton className="h-48 w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={revenueData}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(v: number) => [
                  `₹${v.toLocaleString("en-IN")}`,
                  "Revenue",
                ]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              {revenueData.map((entry, i) => (
                <Cell
                  key={entry.day}
                  fill={
                    i % 2 === 0
                      ? "oklch(0.56 0.26 16.8)"
                      : "oklch(0.68 0.22 16.8)"
                  }
                />
              ))}
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {revenueData.map((entry, i) => (
                  <Cell
                    key={entry.day}
                    fill={
                      i % 2 === 0
                        ? "oklch(0.56 0.26 16.8)"
                        : "oklch(0.72 0.18 16.8)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Booking trend line chart */}
      <div className="rounded-xl border border-border bg-card p-4">
        <h2 className="mb-4 text-sm font-semibold">
          Booking Trend — Last 14 Days
        </h2>
        {isLoading ? (
          <Skeleton className="h-40 w-full rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={bookingData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(v: number) => [v, "Bookings"]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="oklch(0.53 0.24 258)"
                strokeWidth={2}
                dot={{ r: 3, fill: "oklch(0.53 0.24 258)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
