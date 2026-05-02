import { createActor } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Payment, PendingPayout } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { toast } from "sonner";

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function MethodBadge({ method }: { method: string }) {
  const cfg: Record<string, string> = {
    upi: "bg-purple-50 text-purple-700",
    card: "bg-blue-50 text-blue-700",
    wallet: "bg-emerald-50 text-emerald-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ring-1 ring-inset ring-border ${
        cfg[method] ?? "bg-muted text-muted-foreground"
      }`}
    >
      {method}
    </span>
  );
}

export default function AdminPayments() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["adminPayments"],
    queryFn: async () => (actor ? actor.getAdminPayments() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: payouts, isLoading: payoutsLoading } = useQuery<
    PendingPayout[]
  >({
    queryKey: ["pendingPayouts"],
    queryFn: async () => (actor ? actor.getPendingPayouts() : []),
    enabled: !!actor && !isFetching,
  });

  const releaseMutation = useMutation({
    mutationFn: async (bookingId: bigint) => {
      if (!actor) throw new Error();
      await actor.markPayoutProcessed(bookingId);
    },
    onSuccess: () => {
      toast.success("Payout marked as processed!");
      qc.invalidateQueries({ queryKey: ["pendingPayouts"] });
    },
    onError: () => toast.error("Failed to process payout"),
  });

  const unprocessed = (payouts ?? []).filter((p) => !p.processed);
  const totalRevenue = (payments ?? []).reduce(
    (sum, p) => sum + Number(p.amount),
    0,
  );

  return (
    <div className="space-y-6" data-ocid="admin_payments.page">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Payments</h1>
        <div className="rounded-xl border border-border bg-card px-4 py-2 text-center">
          <p className="font-display text-lg font-bold text-emerald-600">
            ₹{totalRevenue.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-muted-foreground">Total collected</p>
        </div>
      </div>

      {/* Pending payouts */}
      {(payoutsLoading || unprocessed.length > 0) && (
        <div className="rounded-xl border border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 border-b border-amber-200 px-4 py-3">
            <Clock className="h-4 w-4 text-amber-600" />
            <h2 className="text-sm font-semibold text-amber-800">
              Pending Owner Payouts
            </h2>
            {!payoutsLoading && (
              <span className="ml-auto rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                {unprocessed.length}
              </span>
            )}
          </div>
          {payoutsLoading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 2 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
                <Skeleton key={i} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-amber-100">
              {unprocessed.map((p, i) => (
                <div
                  key={String(p.bookingId)}
                  className="flex items-center justify-between px-4 py-3"
                  data-ocid={`admin_payouts.item.${i + 1}`}
                >
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Booking #{String(p.bookingId)}
                    </p>
                    <p className="text-xs text-amber-700">
                      ₹{Number(p.amount).toLocaleString("en-IN")} &bull;
                      Release: {formatDate(p.releaseAt)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-lg bg-primary text-primary-foreground text-xs"
                    onClick={() => releaseMutation.mutate(p.bookingId)}
                    disabled={releaseMutation.isPending}
                    data-ocid={`admin_payouts.release_button.${i + 1}`}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" /> Mark Processed
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payments table */}
      <div>
        <h2 className="mb-3 text-sm font-semibold flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          All Payments
        </h2>
        {paymentsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : !payments?.length ? (
          <div
            className="rounded-xl border border-border bg-card py-10 text-center"
            data-ocid="admin_payments.empty_state"
          >
            <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">
              No payments recorded
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  {[
                    "Payment ID",
                    "Booking ID",
                    "Amount",
                    "Method",
                    "Status",
                    "Date",
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
                {payments.map((p, i) => (
                  <tr
                    key={String(p.id)}
                    data-ocid={`admin_payments.item.${i + 1}`}
                    className="hover:bg-muted/30 transition-smooth"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      #{String(p.id)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      #{String(p.bookingId)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">
                      ₹{Number(p.amount).toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <MethodBadge method={p.paymentMethod} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
