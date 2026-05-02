import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { CheckSquare, LogOut } from "lucide-react";

export function ExecutiveLayout() {
  const location = useLocation();
  const { logout } = useAuth();
  const isTaskDetail = location.pathname.includes("/executive/task/");

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            <span className="font-display text-lg font-bold">
              <span className="text-primary">X</span>OLEN
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                Field
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isTaskDetail && (
              <Link
                to="/executive/tasks"
                data-ocid="exec_header.tasks_link"
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-smooth",
                  location.pathname === "/executive/tasks"
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                My Tasks
              </Link>
            )}
            <button
              type="button"
              onClick={() => logout()}
              data-ocid="exec_header.logout_button"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-smooth hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-4">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-muted/40 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
