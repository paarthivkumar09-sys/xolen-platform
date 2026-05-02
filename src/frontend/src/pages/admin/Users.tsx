import { createActor } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProfile } from "@/types";
import { UserRole } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldOff, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type RoleFilter = "all" | "customer" | "owner" | "executive" | "admin";

const ROLE_TABS: { key: RoleFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "customer", label: "Customers" },
  { key: "owner", label: "Owners" },
  { key: "executive", label: "Executives" },
  { key: "admin", label: "Admins" },
];

const ROLE_COLORS: Record<string, string> = {
  [UserRole.customer]: "bg-blue-50 text-blue-700",
  [UserRole.owner]: "bg-violet-50 text-violet-700",
  [UserRole.executive]: "bg-amber-50 text-amber-700",
  [UserRole.admin]: "bg-primary/10 text-primary",
};

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export default function AdminUsers() {
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [search, setSearch] = useState("");
  const [blacklistTarget, setBlacklistTarget] = useState<Principal | null>(
    null,
  );

  const { data: users, isLoading } = useQuery<UserProfile[]>({
    queryKey: ["adminUsers"],
    queryFn: async () => (actor ? actor.getAdminUsers() : []),
    enabled: !!actor && !isFetching,
  });

  const blacklistMutation = useMutation({
    mutationFn: async (userId: Principal) => {
      if (!actor) throw new Error();
      await actor.blacklistUser(userId);
    },
    onSuccess: () => {
      toast.success("User blacklisted");
      setBlacklistTarget(null);
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: () => toast.error("Failed to blacklist user"),
  });

  const filtered = useMemo(() => {
    let list = users ?? [];
    if (roleFilter !== "all") list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.phone.includes(q),
      );
    }
    return list;
  }, [users, roleFilter, search]);

  return (
    <div className="space-y-4" data-ocid="admin_users.page">
      <h1 className="font-display text-xl font-bold">Users</h1>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Role filter tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-muted/40 p-1">
          {ROLE_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              data-ocid={`admin_users.${key}_tab`}
              onClick={() => setRoleFilter(key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-smooth ${
                roleFilter === key
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email…"
            className="pl-8 h-8 text-sm"
            data-ocid="admin_users.search_input"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-xl border border-border bg-card py-12 text-center"
          data-ocid="admin_users.empty_state"
        >
          <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                {[
                  "Name",
                  "Email / Phone",
                  "Role",
                  "Status",
                  "Joined",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {filtered.map((u, i) => (
                <tr
                  key={u.id.toString()}
                  data-ocid={`admin_users.item.${i + 1}`}
                  className="hover:bg-muted/30 transition-smooth"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name || "—"}</p>
                    {u.blacklisted && (
                      <span className="text-[10px] font-semibold text-destructive">
                        BLACKLISTED
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs">{u.email || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {u.phone || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={`text-xs ${ROLE_COLORS[u.role] ?? ""}`}
                    >
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={u.verificationStatus} />
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    {!u.blacklisted && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs border-destructive text-destructive hover:bg-destructive/10"
                        data-ocid={`admin_users.blacklist_button.${i + 1}`}
                        onClick={() => setBlacklistTarget(u.id)}
                      >
                        <ShieldOff className="h-3 w-3 mr-1" /> Blacklist
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AlertDialog
        open={blacklistTarget !== null}
        onOpenChange={(v) => !v && setBlacklistTarget(null)}
      >
        <AlertDialogContent data-ocid="admin_users.blacklist_dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Blacklist User?</AlertDialogTitle>
            <AlertDialogDescription>
              This user will lose access to the platform. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="admin_users.blacklist_cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-ocid="admin_users.blacklist_confirm_button"
              onClick={() =>
                blacklistTarget && blacklistMutation.mutate(blacklistTarget)
              }
            >
              Blacklist
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {users?.length ?? 0} users
      </p>
    </div>
  );
}
