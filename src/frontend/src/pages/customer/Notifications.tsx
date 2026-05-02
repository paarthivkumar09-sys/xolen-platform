import { NotificationItem } from "@/components/shared/NotificationItem";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, CheckCheck } from "lucide-react";

function NotificationSkeletonItem() {
  return (
    <div className="flex items-start gap-3 rounded-xl p-3">
      <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export default function Notifications() {
  const { notifications, isLoading, unreadCount, markRead } =
    useNotifications();

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read);
    await Promise.allSettled(unread.map((n) => markRead(n.id)));
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-display text-xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && !isLoading && (
          <Button
            type="button"
            data-ocid="notifications.mark_all_read_button"
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="h-8 gap-1.5 text-xs text-primary hover:text-primary/80"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className="rounded-xl border border-border bg-card divide-y divide-border"
          data-ocid="notifications.loading_state"
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <NotificationSkeletonItem key={i} />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div
          className="flex flex-col items-center py-20 text-center"
          data-ocid="notifications.empty_state"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Bell className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-display font-bold text-foreground">
            No notifications yet
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We'll notify you about bookings, payments, and updates
          </p>
        </div>
      ) : (
        <div
          className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border"
          data-ocid="notifications.list"
        >
          {notifications.map((n, i) => (
            <div key={String(n.id)} className="px-1 py-0.5">
              <NotificationItem
                notification={n}
                onMarkRead={markRead}
                index={i}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
