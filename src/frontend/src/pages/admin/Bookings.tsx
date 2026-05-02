import { createActor } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Booking } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type TabKey = "all" | "active" | "refunded" | "completed";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "refunded", label: "Refunded" },
  { key: "completed", label: "Completed" },
];

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export default function AdminBookings() {
  const { actor, isFetching } = useActor(createActor);
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");

  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ["adminBookings"],
    queryFn: async () => (actor ? actor.getAdminBookings() : []),
    enabled: !!actor && !isFetching,
  });

  const filtered = useMemo(() => {
    let list = bookings ?? [];
    if (tab === "active")
      list = list.filter(
        (b) => b.paymentStatus === "success" && b.decisionStatus === "pending",
      );
    else if (tab === "refunded")
      list = list.filter((b) => b.decisionStatus === "refunded");
    else if (tab === "completed")
      list = list.filter((b) => b.decisionStatus === "accepted");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          String(b.id).includes(q) ||
          b.customerId.toString().toLowerCase().includes(q),
      );
    }
    return list;
  }, [bookings, tab, search]);

  return (
    <div className="space-y-4" data-ocid="admin_bookings.page">
      <h1 className="font-display text-xl font-bold">All Bookings</h1>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div className="flex gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              data-ocid={`admin_bookings.${key}_tab`}
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-smooth ${
                tab === key
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or customer…"
            className="pl-8 h-8 text-sm"
            data-ocid="admin_bookings.search_input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-12 rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl border border-border bg-card py-12 text-center text-muted-foreground"
          data-ocid="admin_bookings.empty_state"
        >
          <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
          <p className="text-sm">No bookings found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {[
                  "Booking ID",
                  "Customer",
                  "Property",
                  "Check-in",
                  "Check-out",
                  "Amount",
                  "Decision",
                  "Payment",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((b, i) => (
                <tr
                  key={String(b.id)}
                  data-ocid={`admin_bookings.item.${i + 1}`}
                  className="hover:bg-muted/30 transition-smooth"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{String(b.id)}
                  </td>
                  <td className="px-4 py-3 max-w-[120px] truncate text-xs">
                    {b.customerId.toString().slice(0, 12)}…
                  </td>
                  <td className="px-4 py-3">#{String(b.propertyId)}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {formatDate(b.checkIn)}
                  </td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {formatDate(b.checkOut)}
                  </td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    ₹{Number(b.totalPrice).toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.decisionStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={b.paymentStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {bookings?.length ?? 0} bookings
      </p>
    </div>
  );
}
