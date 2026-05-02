import { XolenBadge } from "@/components/shared/XolenBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { PaymentMethod, PropertyStatus } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  CalendarDays,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  Smartphone,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ADDONS = [
  {
    id: "ac",
    name: "AC Cleaning",
    description: "Deep clean your AC unit",
    price: 500,
    icon: "\u2744\ufe0f",
  },
  {
    id: "home",
    name: "Home Cleaning",
    description: "Full home deep clean",
    price: 800,
    icon: "\ud83e\uddf9",
  },
  {
    id: "setup",
    name: "Setup Kit",
    description: "Essentials kit for move-in",
    price: 1500,
    icon: "\ud83d\udce6",
  },
];

const MIN_DAYS = 15;

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmt(n: number): string {
  return `\u20b9${n.toLocaleString("en-IN")}`;
}

const STEPS = ["Dates", "Add-ons", "Review", "Payment"];

export default function Checkout() {
  const search = useSearch({ strict: false }) as { propertyId?: string };
  const propertyId = search.propertyId ?? "";
  const navigate = useNavigate();
  const { actor, ready } = useBackend();

  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState<Date>(() => addDays(new Date(), 1));
  const [totalDays, setTotalDays] = useState(MIN_DAYS);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.upi,
  );

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProperty(BigInt(propertyId));
    },
    enabled: ready && !!propertyId,
  });

  const { data: services } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getServices();
    },
    enabled: ready,
  });

  // Map local addon key to backend service id
  const addonServiceMap: Record<string, bigint> = {};
  if (services) {
    for (const svc of services) {
      if (svc.name.toLowerCase().includes("ac")) addonServiceMap.ac = svc.id;
      else if (svc.name.toLowerCase().includes("home"))
        addonServiceMap.home = svc.id;
      else if (svc.name.toLowerCase().includes("setup"))
        addonServiceMap.setup = svc.id;
    }
  }

  const checkOut = addDays(checkIn, totalDays);
  const perDay = property ? Number(property.perDayPrice) : 0;
  const roomCost = perDay * totalDays;
  const addonTotal = ADDONS.filter((a) => selectedAddons.has(a.id)).reduce(
    (s, a) => s + a.price,
    0,
  );
  const total = roomCost + addonTotal;

  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !property) throw new Error("Not ready");
      const checkInNs = BigInt(checkIn.getTime()) * 1_000_000n;
      const addonIds = ADDONS.filter((a) => selectedAddons.has(a.id))
        .map((a) => addonServiceMap[a.id])
        .filter((id): id is bigint => id !== undefined);

      const booking = await actor.createBooking({
        propertyId: property.id,
        checkIn: checkInNs,
        totalDays: BigInt(totalDays),
        serviceAddonIds: addonIds,
      });

      await actor.createPayment({
        bookingId: booking.id,
        amount: BigInt(total),
        paymentMethod,
      });

      return booking;
    },
    onSuccess: (booking) => {
      toast.success("Payment successful! Booking confirmed.");
      navigate({ to: "/booking/$id", params: { id: String(booking.id) } });
    },
    onError: () => {
      toast.error("Payment failed. Please try again.");
    },
  });

  if (!propertyId) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 py-20"
        data-ocid="checkout.error_state"
      >
        <p className="text-muted-foreground">No property selected.</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="text-primary underline"
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (isLoading || !ready) {
    return (
      <div className="space-y-4" data-ocid="checkout.loading_state">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="py-20 text-center" data-ocid="checkout.error_state">
        <p className="text-muted-foreground">Property not found.</p>
      </div>
    );
  }

  const isVerified = property.status === PropertyStatus.verified;
  const todayStr = addDays(new Date(), 1).toISOString().split("T")[0];

  return (
    <div className="pb-6" data-ocid="checkout.page">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <button
          type="button"
          data-ocid="checkout.back_button"
          onClick={() =>
            step > 0
              ? setStep(step - 1)
              : navigate({ to: "/property/$id", params: { id: propertyId } })
          }
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/70"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h1 className="font-display text-lg font-bold text-foreground">
          Checkout
        </h1>
      </div>

      {/* Step Progress */}
      <div className="mb-6 flex items-center gap-1" data-ocid="checkout.steps">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-smooth ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-[10px] font-medium ${
                i <= step ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Property Summary */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        <img
          src={
            property.photos[0]?.getDirectURL() ??
            "/assets/images/placeholder.svg"
          }
          alt={property.location.address}
          className="h-14 w-14 rounded-lg object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/assets/images/placeholder.svg";
          }}
        />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm font-semibold text-foreground">
            {property.location.address}
          </p>
          <p className="text-xs text-muted-foreground">
            {property.location.city}
          </p>
          <p className="mt-0.5 font-bold text-primary">
            \u20b9{Number(property.perDayPrice).toLocaleString("en-IN")}/day
          </p>
        </div>
        {isVerified && <XolenBadge />}
      </div>

      {/* Step 0: Dates */}
      {step === 0 && (
        <div className="space-y-4" data-ocid="checkout.dates_step">
          <h2 className="font-display text-base font-semibold text-foreground">
            Select Dates
          </h2>
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold text-muted-foreground"
                htmlFor="checkin-date"
              >
                Check-in Date
              </label>
              <input
                id="checkin-date"
                type="date"
                data-ocid="checkout.checkin_input"
                min={todayStr}
                value={checkIn.toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(new Date(e.target.value))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold text-muted-foreground"
                htmlFor="total-days"
              >
                Duration (minimum {MIN_DAYS} days)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  data-ocid="checkout.days_decrease_button"
                  onClick={() => setTotalDays((d) => Math.max(MIN_DAYS, d - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted font-bold text-foreground transition-smooth hover:bg-muted/70"
                >
                  \u2013
                </button>
                <span
                  className="flex-1 text-center font-display text-lg font-bold text-foreground"
                  data-ocid="checkout.days_count"
                >
                  {totalDays} days
                </span>
                <button
                  type="button"
                  data-ocid="checkout.days_increase_button"
                  onClick={() => setTotalDays((d) => d + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted font-bold text-foreground transition-smooth hover:bg-muted/70"
                >
                  +
                </button>
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Check-in:</span>
                <span className="font-semibold text-foreground">
                  {formatDate(checkIn)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Check-out:</span>
                <span className="font-semibold text-foreground">
                  {formatDate(checkOut)}
                </span>
              </div>
            </div>
          </div>
          <Button
            type="button"
            data-ocid="checkout.next_button"
            className="w-full rounded-xl py-5 font-display font-bold"
            onClick={() => setStep(1)}
          >
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 1: Add-ons */}
      {step === 1 && (
        <div className="space-y-4" data-ocid="checkout.addons_step">
          <h2 className="font-display text-base font-semibold text-foreground">
            Add-on Services
          </h2>
          <p className="text-xs text-muted-foreground">
            Make your stay even better
          </p>
          <div className="space-y-3">
            {ADDONS.map((addon) => {
              const selected = selectedAddons.has(addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  data-ocid={`checkout.addon_${addon.id}_toggle`}
                  onClick={() => {
                    const next = new Set(selectedAddons);
                    if (selected) next.delete(addon.id);
                    else next.add(addon.id);
                    setSelectedAddons(next);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-smooth ${
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <span className="text-2xl">{addon.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">
                      {addon.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {addon.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-primary">
                      +{fmt(addon.price)}
                    </p>
                    <div
                      className={`mt-1 h-5 w-5 rounded-full border-2 ml-auto flex items-center justify-center transition-smooth ${
                        selected ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {selected && (
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <Button
            type="button"
            data-ocid="checkout.next_button"
            className="w-full rounded-xl py-5 font-display font-bold"
            onClick={() => setStep(2)}
          >
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 2: Price Breakdown */}
      {step === 2 && (
        <div className="space-y-4" data-ocid="checkout.review_step">
          <h2 className="font-display text-base font-semibold text-foreground">
            Price Breakdown
          </h2>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {fmt(perDay)} \u00d7 {totalDays} days
              </span>
              <span className="font-semibold text-foreground">
                {fmt(roomCost)}
              </span>
            </div>
            {ADDONS.filter((a) => selectedAddons.has(a.id)).map((addon) => (
              <div key={addon.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {addon.icon} {addon.name}
                </span>
                <span className="font-semibold text-foreground">
                  +{fmt(addon.price)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-display font-bold text-foreground">
                Total
              </span>
              <span className="font-display text-xl font-bold text-primary">
                {fmt(total)}
              </span>
            </div>
          </div>
          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <p className="text-xs text-muted-foreground">
              Check-in:{" "}
              <span className="font-semibold text-foreground">
                {formatDate(checkIn)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Check-out:{" "}
              <span className="font-semibold text-foreground">
                {formatDate(checkOut)}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              Duration:{" "}
              <span className="font-semibold text-foreground">
                {totalDays} days
              </span>
            </p>
          </div>
          <Button
            type="button"
            data-ocid="checkout.next_button"
            className="w-full rounded-xl py-5 font-display font-bold"
            onClick={() => setStep(3)}
          >
            Proceed to Payment <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Step 3: Payment */}
      {step === 3 && (
        <div className="space-y-4" data-ocid="checkout.payment_step">
          <h2 className="font-display text-base font-semibold text-foreground">
            Payment
          </h2>
          <div className="space-y-3">
            {(
              [
                {
                  method: PaymentMethod.upi,
                  label: "UPI",
                  desc: "Pay with any UPI app",
                  icon: Smartphone,
                },
                {
                  method: PaymentMethod.card,
                  label: "Card",
                  desc: "Debit or Credit card",
                  icon: CreditCard,
                },
                {
                  method: PaymentMethod.wallet,
                  label: "Wallet",
                  desc: "Digital wallet",
                  icon: Wallet,
                },
              ] as const
            ).map(({ method, label, desc, icon: Icon }) => (
              <button
                key={method}
                type="button"
                data-ocid={`checkout.payment_${method}_select`}
                onClick={() => setPaymentMethod(method)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-smooth ${
                  paymentMethod === method
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    paymentMethod === method ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      paymentMethod === method
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                {paymentMethod === method && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card p-4 flex justify-between items-center">
            <span className="font-display font-semibold text-foreground">
              Total to Pay
            </span>
            <span className="font-display text-2xl font-bold text-primary">
              {fmt(total)}
            </span>
          </div>
          <Button
            type="button"
            data-ocid="checkout.pay_button"
            className="w-full rounded-xl py-5 font-display text-base font-bold"
            disabled={bookMutation.isPending}
            onClick={() => bookMutation.mutate()}
          >
            {bookMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </span>
            ) : (
              `Pay ${fmt(total)}`
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Not satisfied? Get{" "}
            <span className="font-semibold text-primary">90% refund</span>{" "}
            within 30 min of visit
          </p>
        </div>
      )}
    </div>
  );
}
