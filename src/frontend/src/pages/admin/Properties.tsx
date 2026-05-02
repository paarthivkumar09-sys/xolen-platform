import { createActor } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { XolenBadge } from "@/components/shared/XolenBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Property, UserProfile } from "@/types";
import { PropertyStatus, UserRole } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CheckCircle, MapPin, User, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function PropertyTypeLabel(type: string) {
  const MAP: Record<string, string> = {
    oneRK: "1 RK",
    oneBHK: "1 BHK",
    twoBHK: "2 BHK",
    threeBHK: "3 BHK",
    room: "Room",
  };
  return MAP[type] ?? type;
}

function PropertyRowSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 flex-1 rounded-lg" />
        <Skeleton className="h-8 flex-1 rounded-lg" />
      </div>
    </div>
  );
}

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading: boolean;
}

function RejectModal({ open, onClose, onConfirm, loading }: RejectModalProps) {
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent data-ocid="admin_properties.reject_dialog">
        <DialogHeader>
          <DialogTitle>Reject Property</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Provide a reason for rejection. The owner will be notified.
        </p>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Photos don't match actual condition"
          rows={3}
          data-ocid="admin_properties.reject_reason_textarea"
        />
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="admin_properties.reject_cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!reason.trim() || loading}
            onClick={() => onConfirm(reason)}
            data-ocid="admin_properties.reject_confirm_button"
          >
            Reject Property
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProperties() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [rejectTarget, setRejectTarget] = useState<bigint | null>(null);
  const [assignMap, setAssignMap] = useState<Record<string, string>>({});

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["adminProperties"],
    queryFn: async () => (actor ? actor.getAdminProperties() : []),
    enabled: !!actor && !isFetching,
  });

  const { data: users } = useQuery<UserProfile[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => (actor ? actor.getAdminUsers() : []),
    enabled: !!actor && !isFetching,
  });

  const executives = (users ?? []).filter((u) => u.role === UserRole.executive);

  const approveMutation = useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error();
      await actor.approveProperty(id, null);
    },
    onSuccess: () => {
      toast.success("Property approved and listed!");
      qc.invalidateQueries({ queryKey: ["adminProperties"] });
    },
    onError: () => toast.error("Approval failed"),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: bigint; notes: string }) => {
      if (!actor) throw new Error();
      await actor.rejectProperty(id, notes);
    },
    onSuccess: () => {
      toast.success("Property rejected");
      setRejectTarget(null);
      qc.invalidateQueries({ queryKey: ["adminProperties"] });
    },
    onError: () => toast.error("Rejection failed"),
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      propertyId,
      executiveId,
    }: { propertyId: bigint; executiveId: string }) => {
      if (!actor) throw new Error();
      const exec = executives.find((e) => e.id.toString() === executiveId);
      if (!exec) throw new Error("Executive not found");
      await actor.assignExecutive(propertyId, exec.id);
    },
    onSuccess: (_, vars) => {
      toast.success("Executive assigned");
      qc.invalidateQueries({ queryKey: ["adminProperties"] });
      const key = vars.propertyId.toString();
      setAssignMap((prev) => ({ ...prev, [key]: vars.executiveId }));
    },
    onError: () => toast.error("Assignment failed"),
  });

  const pending = (properties ?? []).filter(
    (p) =>
      p.status === PropertyStatus.pending ||
      p.status === PropertyStatus.assigned,
  );
  const verified = (properties ?? []).filter(
    (p) => p.status === PropertyStatus.verified,
  );
  const rejected = (properties ?? []).filter(
    (p) => p.status === PropertyStatus.rejected,
  );

  function PropertyCard({
    p,
    idx,
    showActions,
  }: { p: Property; idx: number; showActions: boolean }) {
    const key = p.id.toString();
    const selectedExec = assignMap[key] ?? "";
    return (
      <div
        className="rounded-xl border border-border bg-card p-4"
        data-ocid={`admin_properties.item.${idx}`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="font-semibold truncate">{p.location.address}</p>
              {p.status === PropertyStatus.verified && <XolenBadge />}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <MapPin className="h-3 w-3" />
                {p.location.city}
              </span>
              <span>{PropertyTypeLabel(p.propertyType)}</span>
              <span>₹{Number(p.perDayPrice).toLocaleString("en-IN")}/day</span>
              <span className="flex items-center gap-0.5">
                <User className="h-3 w-3" />
                {p.photos.length} photos
              </span>
            </div>
          </div>
          <StatusBadge status={p.status} />
        </div>
        {showActions && (
          <div className="mt-3 space-y-2">
            {executives.length > 0 && (
              <div className="flex gap-2">
                <Select
                  value={selectedExec}
                  onValueChange={(v) =>
                    setAssignMap((prev) => ({ ...prev, [key]: v }))
                  }
                >
                  <SelectTrigger
                    className="h-8 flex-1 text-xs"
                    data-ocid={`admin_properties.exec_select.${idx}`}
                  >
                    <SelectValue placeholder="Assign executive…" />
                  </SelectTrigger>
                  <SelectContent>
                    {executives.map((e) => (
                      <SelectItem key={e.id.toString()} value={e.id.toString()}>
                        {e.name || e.id.toString().slice(0, 12)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs px-3"
                  disabled={!selectedExec || assignMutation.isPending}
                  onClick={() =>
                    assignMutation.mutate({
                      propertyId: p.id,
                      executiveId: selectedExec,
                    })
                  }
                  data-ocid={`admin_properties.assign_button.${idx}`}
                >
                  Assign
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                className="flex-1 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => approveMutation.mutate(p.id)}
                disabled={approveMutation.isPending}
                data-ocid={`admin_properties.approve_button.${idx}`}
              >
                <CheckCircle className="mr-1 h-3 w-3" /> Approve
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => setRejectTarget(p.id)}
                disabled={rejectMutation.isPending}
                data-ocid={`admin_properties.reject_button.${idx}`}
              >
                <XCircle className="mr-1 h-3 w-3" /> Reject
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="admin_properties.page">
      <h1 className="font-display text-xl font-bold">Properties</h1>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4" data-ocid="admin_properties.tabs">
          <TabsTrigger value="pending" data-ocid="admin_properties.pending_tab">
            Pending
            {pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 text-[10px] font-bold text-white">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="verified"
            data-ocid="admin_properties.verified_tab"
          >
            Verified
          </TabsTrigger>
          <TabsTrigger
            value="rejected"
            data-ocid="admin_properties.rejected_tab"
          >
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <PropertyRowSkeleton key={i} />
            ))
          ) : pending.length === 0 ? (
            <div
              className="rounded-xl border border-border bg-card py-12 text-center"
              data-ocid="admin_properties.pending_empty_state"
            >
              <Building2 className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">
                No pending properties
              </p>
            </div>
          ) : (
            pending.map((p, i) => (
              <PropertyCard
                key={String(p.id)}
                p={p}
                idx={i + 1}
                showActions={true}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="verified" className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <PropertyRowSkeleton key={i} />
            ))
          ) : verified.length === 0 ? (
            <div
              className="rounded-xl border border-border bg-card py-12 text-center"
              data-ocid="admin_properties.verified_empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No verified properties
              </p>
            </div>
          ) : (
            verified.map((p, i) => (
              <PropertyCard
                key={String(p.id)}
                p={p}
                idx={i + 1}
                showActions={false}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
              <PropertyRowSkeleton key={i} />
            ))
          ) : rejected.length === 0 ? (
            <div
              className="rounded-xl border border-border bg-card py-12 text-center"
              data-ocid="admin_properties.rejected_empty_state"
            >
              <p className="text-sm text-muted-foreground">
                No rejected properties
              </p>
            </div>
          ) : (
            rejected.map((p, i) => (
              <PropertyCard
                key={String(p.id)}
                p={p}
                idx={i + 1}
                showActions={false}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <RejectModal
        open={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (rejectTarget !== null)
            rejectMutation.mutate({ id: rejectTarget, notes: reason });
        }}
        loading={rejectMutation.isPending}
      />
    </div>
  );
}
