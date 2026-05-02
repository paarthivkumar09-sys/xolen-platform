import { createActor } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminAnalytics, Booking } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Building2,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

const EMPTY_ANALYTICS: AdminAnalytics = {
  totalProperties: 0n,
  totalBookings: 0n,
  totalUsers: 0n,
  totalRevenue: 0n,
  activeStays: 0n,
  pendingVerifications: 0n,
  refundsProcessed: 0n,
};

export default function AdminDashboard() {
  const { actor, isFetching } = useActor(createActor);
  const ready = !!actor && !isFetching;

  const { data: analytics, isLoading: analyticsLoading } =
    useQuery<AdminAnalytics>({
      queryKey: ["adminAnalytics"],
      queryFn: async () =>
        actor ? actor.getAdminAnalytics() : EMPTY_ANALYTICS,
      enabled: ready,
    });

  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["adminBookings"],
    queryFn: async () => (actor ? actor.getAdminBookings() : []),
    enabled: ready,
  });

  const recentBookings = (bookings ?? []).slice(0, 5);

  const kpis = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₹${Number(analytics?.totalRevenue ?? 0n).toLocaleString("en-IN")}`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      icon: BookOpen,
      label: "Total Bookings",
      value: String(analytics?.totalBookings ?? 0n),
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      label: "Active Stays",
      value: String(analytics?.activeStays ?? 0n),
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: AlertTriangle,
      label: "Pending Verifications",
      value: String(analytics?.pendingVerifications ?? 0n),
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: Building2,
      label: "Properties",
      value: String(analytics?.totalProperties ?? 0n),
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      icon: Users,
      label: "Total Users",
      value: String(analytics?.totalUsers ?? 0n),
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
  ];

  const quickActions = [
    {
      label: "Review Properties",
      to: "/admin/properties",
      icon: Building2,
      badge: Number(analytics?.pendingVerifications ?? 0n),
    },
    { label: "View Bookings", to: "/admin/bookings", icon: BookOpen, badge: 0 },
    { label: "Manage Users", to: "/admin/users", icon: Users, badge: 0 },
    { label: "Analytics", to: "/admin/analytics", icon: BarChart3, badge: 0 },
  ];

  return (
    <div className="space-y-6" data-ocid="admin_dashboard.page">
      <div>
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back, admin. Here's what's happening.
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {analyticsLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))
          : kpis.map(({ icon: Icon, label, value, color, bg }) => (
              <div
                key={label}
                className="rounded-xl border border-border bg-card p-4"
                data-ocid={`admin_dashboard.kpi.${label.toLowerCase().replace(/\s+/g, "_")}`}
              >
                <div className={`mb-2 inline-flex rounded-lg p-1.5 ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <p className={`font-display text-2xl font-bold ${color}`}>
                  {value}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Recent Bookings</h2>
            <Link
              to="/admin/bookings"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
              data-ocid="admin_dashboard.view_bookings_link"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {bookingsLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Skeleton key={i} className="h-10 rounded-lg" />
              ))}
            </div>
          ) : recentBookings.length === 0 ? (
            <p
              className="py-8 text-center text-sm text-muted-foreground"
              data-ocid="admin_dashboard.bookings_empty_state"
            >
              No bookings yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["ID", "Property", "Days", "Amount", "Status"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentBookings.map((b, i) => (
                    <tr
                      key={String(b.id)}
                      className="hover:bg-muted/30"
                      data-ocid={`admin_dashboard.booking_row.${i + 1}`}
                    >
                      <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">
                        #{String(b.id)}
                      </td>
                      <td className="px-4 py-2.5">#{String(b.propertyId)}</td>
                      <td className="px-4 py-2.5">{Number(b.totalDays)}d</td>
                      <td className="px-4 py-2.5 font-semibold">
                        ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={b.paymentStatus} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-1 p-3">
            {quickActions.map(({ label, to, icon: Icon, badge }) => (
              <Link
                key={to}
                to={to}
                data-ocid={`admin_dashboard.quick_action.${label.toLowerCase().replace(/\s+/g, "_")}_link`}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {badge > 0 && (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {badge}
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
