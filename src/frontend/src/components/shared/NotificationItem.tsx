import { cn } from "@/lib/utils";
import type { Notification } from "@/types";
import { NotificationType } from "@/types";
import {
  Bell,
  CheckCircle,
  CreditCard,
  FileText,
  RefreshCw,
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: bigint) => void;
  index?: number;
}

const typeIcons: Record<string, React.ReactNode> = {
  [NotificationType.bookingConfirmed]: (
    <CheckCircle className="h-4 w-4 text-emerald-600" />
  ),
  [NotificationType.paymentSuccess]: (
    <CreditCard className="h-4 w-4 text-blue-600" />
  ),
  [NotificationType.visitReminder]: <Bell className="h-4 w-4 text-amber-600" />,
  [NotificationType.extendReminder]: (
    <RefreshCw className="h-4 w-4 text-primary" />
  ),
  [NotificationType.docUploaded]: (
    <FileText className="h-4 w-4 text-purple-600" />
  ),
  [NotificationType.refundProcessed]: (
    <RefreshCw className="h-4 w-4 text-emerald-600" />
  ),
};

function timeAgo(ts: bigint): string {
  const ms = Date.now() - Number(ts) / 1_000_000;
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationItem({
  notification,
  onMarkRead,
  index = 0,
}: NotificationItemProps) {
  return (
    <button
      type="button"
      data-ocid={`notification.item.${index + 1}`}
      onClick={() => !notification.read && onMarkRead?.(notification.id)}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl p-3 text-left transition-smooth hover:bg-muted/60",
        !notification.read && "bg-primary/5",
      )}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        {typeIcons[notification.notificationType] ?? (
          <Bell className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm text-foreground",
            !notification.read && "font-semibold",
          )}
        >
          {notification.message}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
      )}
    </button>
  );
}
