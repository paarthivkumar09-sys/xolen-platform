import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserRole } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  {
    role: UserRole.customer,
    label: "Guest / Tenant",
    description: "Browse and book verified stays",
    emoji: "🏠",
  },
  {
    role: UserRole.owner,
    label: "Property Owner",
    description: "List and manage your properties",
    emoji: "🔑",
  },
] as const;

export default function Setup() {
  const navigate = useNavigate();
  const { saveProfile, isSaving } = useUserProfile();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.customer);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Please fill in your name and phone number");
      return;
    }
    try {
      await saveProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        role: selectedRole,
      });
      toast.success("Profile created! Welcome to XOLEN.");
      if (selectedRole === UserRole.owner) {
        navigate({ to: "/owner/dashboard" });
      } else {
        navigate({ to: "/" });
      }
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="font-display text-3xl font-bold">
            <span className="text-primary">X</span>OLEN
          </h1>
          <p className="mt-1 text-muted-foreground">
            Let's set up your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Role Selection */}
          <div>
            <Label className="mb-2 block text-sm font-semibold">
              I am a...
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map(({ role, label, description, emoji }) => (
                <button
                  key={role}
                  type="button"
                  data-ocid={`setup.role_${role}_toggle`}
                  onClick={() => setSelectedRole(role)}
                  className={`rounded-xl border p-4 text-left transition-smooth ${
                    selectedRole === role
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="text-2xl">{emoji}</div>
                  <div className="mt-1.5 font-semibold text-sm text-foreground">
                    {label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-sm font-semibold">
              Full Name
            </Label>
            <Input
              id="name"
              data-ocid="setup.name_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1 rounded-xl"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="text-sm font-semibold">
              Phone Number
            </Label>
            <Input
              id="phone"
              data-ocid="setup.phone_input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              type="tel"
              className="mt-1 rounded-xl"
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-sm font-semibold">
              Email{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </Label>
            <Input
              id="email"
              data-ocid="setup.email_input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              type="email"
              className="mt-1 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            data-ocid="setup.submit_button"
            disabled={isSaving}
            className="w-full rounded-xl bg-primary py-6 font-display text-base font-bold text-primary-foreground shadow-md transition-smooth hover:bg-primary/90"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              "Get Started →"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
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
