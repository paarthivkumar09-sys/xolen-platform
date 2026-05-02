import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield, Star, Zap } from "lucide-react";
import { useEffect } from "react";

const TRUST_POINTS = [
  { icon: Shield, text: "XOLEN Verified properties only" },
  { icon: Star, text: "90% refund if not satisfied" },
  { icon: Zap, text: "Instant booking confirmation" },
];

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || profileLoading) return;
    if (!profile) {
      navigate({ to: "/setup" });
    } else {
      switch (profile.role) {
        case "admin":
          navigate({ to: "/admin/dashboard" });
          break;
        case "owner":
          navigate({ to: "/owner/dashboard" });
          break;
        case "executive":
          navigate({ to: "/executive/tasks" });
          break;
        default:
          navigate({ to: "/" });
      }
    }
  }, [isAuthenticated, profile, profileLoading, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            <span className="text-primary">X</span>OLEN
          </h1>
          <p className="mt-2 text-muted-foreground">Stay + Services Platform</p>
        </div>

        {/* Hero card */}
        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="bg-primary/5 px-6 pt-6 pb-4">
            <p className="font-display text-xl font-bold text-foreground">
              Find your perfect stay
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Minimum 15 days. Verified properties. Instant refund guarantee.
            </p>
          </div>
          <div className="space-y-3 px-6 py-4">
            {TRUST_POINTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm text-foreground">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          type="button"
          data-ocid="login.internet_identity_button"
          onClick={() => login()}
          disabled={isLoading || profileLoading}
          className="w-full rounded-xl bg-primary py-6 font-display text-base font-bold text-primary-foreground shadow-md transition-smooth hover:bg-primary/90 active:scale-95"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </span>
          ) : (
            "Continue with Internet Identity"
          )}
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Secure, decentralized login — no password required
        </p>

        {/* Footer */}
        <div className="mt-12 text-center">
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
        </div>
      </div>
    </div>
  );
}
