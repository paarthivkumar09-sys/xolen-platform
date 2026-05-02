import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Bell, Bookmark, Home, Search, User } from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Explore", icon: Home, exact: true },
  { to: "/search", label: "Search", icon: Search, exact: false },
  { to: "/my-bookings", label: "Trips", icon: Bookmark, exact: false },
  { to: "/profile", label: "Profile", icon: User, exact: false },
] as const;

export function CustomerLayout() {
  const location = useLocation();
  const { unreadCount } = useNotifications();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight"
          >
            <span className="text-primary">X</span>OLEN
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/notifications"
              data-ocid="header.notification_button"
              className="relative flex h-9 w-9 items-center justify-center rounded-full transition-smooth hover:bg-muted"
            >
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              data-ocid="header.profile_button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted transition-smooth hover:bg-muted/80"
            >
              <User className="h-4 w-4 text-foreground" />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card pb-safe">
        <div className="mx-auto flex max-w-2xl items-center justify-around">
          {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
            const isActive = exact
              ? location.pathname === to
              : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`bottom_nav.${label.toLowerCase()}_link`}
                className={cn(
                  "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs transition-smooth",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span
                  className={cn("font-medium", isActive && "font-semibold")}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
