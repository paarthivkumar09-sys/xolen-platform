import { createActor } from "@/backend";
import type { DocumentInput } from "@/backend";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { DocType, UploadedBy } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation } from "@tanstack/react-query";
import {
  Check,
  ChevronRight,
  FileText,
  LogOut,
  Pencil,
  Shield,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-primary-foreground shadow-sm">
      {initials || "?"}
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  owner: "Owner",
  admin: "Admin",
  executive: "Executive",
};

export default function CustomerProfile() {
  const { profile, isLoading, updateProfile, isSaving, isUpdating } =
    useUserProfile();
  const { logout, principal } = useAuth();
  const { actor } = useActor(createActor);

  const [isEditing, setIsEditing] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startEdit() {
    setFormName(profile?.name ?? "");
    setFormPhone(profile?.phone ?? "");
    setIsEditing(true);
  }

  async function handleSave() {
    if (!profile) return;
    try {
      await updateProfile({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: profile.email,
        role: profile.role,
      });
      setIsEditing(false);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    }
  }

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!actor) throw new Error("Not connected");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const { ExternalBlob } = await import("@/backend");
      const blob = ExternalBlob.fromBytes(bytes);
      const input: DocumentInput = {
        bookingId: BigInt(0),
        fileBlob: blob,
        docType: DocType.aadhaar,
        uploadedBy: UploadedBy.customer,
      };
      return actor.createDocument(input);
    },
    onSuccess: () => {
      toast.success("ID document uploaded successfully");
      setIsUploading(false);
    },
    onError: () => {
      toast.error("Failed to upload document");
      setIsUploading(false);
    },
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    uploadMutation.mutate(file);
    e.target.value = "";
  }

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    );

  const displayName = profile?.name ?? "User";
  const displayEmail =
    profile?.email ||
    (principal ? `${principal.toString().slice(0, 20)}…` : "");

  return (
    <div className="space-y-5">
      <h1 className="font-display text-xl font-bold">Profile</h1>

      {/* Avatar + identity card */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-4">
          <AvatarInitials name={displayName} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg font-bold text-foreground">
              {displayName}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {displayEmail}
            </p>
            {profile?.role && (
              <span className="mt-1 inline-flex items-center rounded-full bg-secondary/15 px-2 py-0.5 text-[11px] font-semibold text-secondary">
                {ROLE_LABELS[profile.role] ?? profile.role}
              </span>
            )}
          </div>
          {profile && (
            <StatusBadge
              status={profile.verificationStatus}
              className="shrink-0"
            />
          )}
        </div>
      </div>

      {/* ID verification nudge */}
      {profile?.verificationStatus === "unverified" && (
        <div
          className="flex items-center gap-3 rounded-xl border border-secondary/30 bg-secondary/8 px-4 py-3"
          data-ocid="profile.verify_id_banner"
        >
          <Shield className="h-5 w-5 text-secondary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">
              Verify Your ID
            </p>
            <p className="text-xs text-muted-foreground">
              Required to complete your check-in
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-secondary shrink-0" />
        </div>
      )}

      {/* Editable info form */}
      {isEditing ? (
        <div
          className="rounded-xl border border-border bg-card p-4 space-y-4"
          data-ocid="profile.edit_form"
        >
          <p className="font-semibold text-foreground">Edit Profile</p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="edit-name" className="text-sm">
                Full Name
              </Label>
              <Input
                id="edit-name"
                data-ocid="profile.name_input"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Your full name"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-phone" className="text-sm">
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                data-ocid="profile.phone_input"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="+91 98765 43210"
                type="tel"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              data-ocid="profile.save_button"
              onClick={handleSave}
              disabled={isSaving || isUpdating}
              className="flex-1 rounded-xl"
            >
              <Check className="mr-1.5 h-4 w-4" />
              {isSaving || isUpdating ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              data-ocid="profile.cancel_button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-xl"
            >
              <X className="mr-1.5 h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          {[
            { label: "Name", value: profile?.name || "Not set" },
            { label: "Phone", value: profile?.phone || "Not set" },
            { label: "Email", value: profile?.email || "Not set" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="max-w-[55%] truncate text-right text-sm font-medium text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Edit button (shown when not in edit mode) */}
      {!isEditing && (
        <Button
          type="button"
          data-ocid="profile.edit_button"
          variant="outline"
          onClick={startEdit}
          className="w-full rounded-xl"
        >
          <Pencil className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      )}

      {/* Document upload section */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <p className="font-semibold text-foreground text-sm">ID Document</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Upload Aadhaar, Passport, or Driving License for check-in
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Upload ID document"
        />
        <Button
          type="button"
          data-ocid="profile.upload_button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || uploadMutation.isPending}
          className="w-full rounded-xl border-dashed border-2 py-6 text-sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading || uploadMutation.isPending
            ? "Uploading…"
            : "Upload ID Document"}
        </Button>
      </div>

      {/* Logout */}
      <Button
        type="button"
        data-ocid="profile.logout_button"
        onClick={() => logout()}
        variant="outline"
        className="w-full rounded-xl border-destructive text-destructive hover:bg-destructive/5"
      >
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </div>
  );
}
