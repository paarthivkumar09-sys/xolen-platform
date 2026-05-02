import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { UserRole } from "@/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function OwnerSettings() {
  const { profile, updateProfile, isUpdating } = useUserProfile();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phone);
      setEmail(profile.email);
    }
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        phone,
        email,
        role: (profile?.role ?? "owner") as UserRole,
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="max-w-lg space-y-5">
      <h1 className="font-display text-xl font-bold">Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="text-sm font-semibold">Full Name</Label>
          <Input
            data-ocid="owner_settings.name_input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 rounded-xl"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">Phone</Label>
          <Input
            data-ocid="owner_settings.phone_input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 rounded-xl"
          />
        </div>
        <div>
          <Label className="text-sm font-semibold">Email</Label>
          <Input
            data-ocid="owner_settings.email_input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 rounded-xl"
          />
        </div>
        <Button
          type="submit"
          data-ocid="owner_settings.save_button"
          disabled={isUpdating}
          className="rounded-xl bg-primary text-primary-foreground"
        >
          {isUpdating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}
