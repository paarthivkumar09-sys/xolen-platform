import { ExternalBlob, createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCamera } from "@/hooks/useCamera";
import { TaskStatus } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  Check,
  CheckCircle2,
  Loader2,
  RefreshCcw,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const CHECKLIST = [
  { key: "location", label: "Location confirmed on-site" },
  { key: "condition", label: "Property condition verified" },
  { key: "photos", label: "Owner photos match actual rooms" },
  { key: "owner", label: "Owner identity verified" },
];

interface CapturedPhoto {
  file: File;
  preview: string;
}

export default function TaskVerify() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();

  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [uploadingPhotoIdx, setUploadingPhotoIdx] = useState<number | null>(
    null,
  );
  const [uploadedCount, setUploadedCount] = useState(0);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isActive,
    isLoading: camLoading,
    error: camError,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef,
  } = useCamera({ facingMode: "environment", quality: 0.85 });

  const allChecked = CHECKLIST.every((c) => checks[c.key]);

  const handleToggleCamera = async () => {
    if (showCamera) {
      stopCamera();
      setShowCamera(false);
    } else {
      setShowCamera(true);
      await startCamera();
    }
  };

  const handleCapture = () => {
    const file = capturePhoto();
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, { file, preview }]);
    stopCamera();
    setShowCamera(false);
    toast.success("Photo captured!");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, { file, preview }]);
    toast.success("Photo added!");
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadAllPhotos = async () => {
    if (!actor || photos.length === 0) return;
    for (let i = 0; i < photos.length; i++) {
      setUploadingPhotoIdx(i);
      try {
        const bytes = await photos[i].file.arrayBuffer();
        const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
        await actor.uploadVerificationPhoto(BigInt(id), blob);
        setUploadedCount((c) => c + 1);
      } catch {
        toast.error(`Failed to upload photo ${i + 1}`);
        setUploadingPhotoIdx(null);
        return;
      }
    }
    setUploadingPhotoIdx(null);
    return true;
  };

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (photos.length > 0 && uploadedCount < photos.length) {
        const ok = await uploadAllPhotos();
        if (!ok) throw new Error("Photo upload failed");
      }
      await actor.updateTaskStatus(
        BigInt(id),
        TaskStatus.completed,
        notes.trim() || null,
      );
    },
    onSuccess: () => {
      toast.success("Property verified and task completed!");
      qc.invalidateQueries({ queryKey: ["myTasks"] });
      navigate({ to: "/executive/tasks" });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to complete task"),
  });

  const isUploading = uploadingPhotoIdx !== null;

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate({ to: "/executive/task/$id", params: { id } })
          }
          data-ocid="task_verify.back_button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-smooth hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">
            Property Verification
          </h1>
          <p className="text-xs text-muted-foreground">Task #{id}</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="font-semibold text-sm">Verification Checklist</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete all items before marking verified
          </p>
        </div>
        <div className="divide-y divide-border">
          {CHECKLIST.map((item) => (
            <label
              key={item.key}
              data-ocid={`task_verify.check.${item.key}`}
              className="flex cursor-pointer items-center gap-3 px-4 py-4"
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-smooth ${
                  checks[item.key]
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background"
                }`}
              >
                {checks[item.key] && <Check className="h-3.5 w-3.5" />}
              </div>
              <span
                className={`text-sm ${checks[item.key] ? "text-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!checks[item.key]}
                onChange={(e) =>
                  setChecks((prev) => ({
                    ...prev,
                    [item.key]: e.target.checked,
                  }))
                }
              />
            </label>
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="font-semibold text-sm">Property Photos</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Capture real on-site photos for verification
          </p>
        </div>

        {/* Camera preview */}
        {showCamera && (
          <div className="relative bg-black">
            <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
              <video
                ref={videoRef}
                className="h-full w-full object-cover"
                playsInline
                muted
                autoPlay
              />
              {camLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              {camError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-white">
                  <CameraOff className="h-8 w-8" />
                  <p className="text-sm text-center px-4">{camError}</p>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex items-center justify-center gap-4 bg-black px-4 py-4">
              <button
                type="button"
                onClick={handleToggleCamera}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <button
                type="button"
                data-ocid="task_verify.capture_button"
                onClick={handleCapture}
                disabled={!isActive || camLoading}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white disabled:opacity-50"
              >
                <Camera className="h-7 w-7 text-black" />
              </button>
              <button
                type="button"
                onClick={() => switchCamera()}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Captured photos grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 p-3">
            {photos.map((photo, i) => (
              <div
                key={photo.preview}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <img
                  src={photo.preview}
                  alt={`Captured ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                {uploadedCount > i ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/70">
                    <Check className="h-6 w-6 text-white" />
                  </div>
                ) : uploadingPhotoIdx === i ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Camera / upload buttons */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <button
            type="button"
            data-ocid="task_verify.camera_button"
            onClick={handleToggleCamera}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 font-semibold text-primary transition-smooth hover:bg-primary/10"
          >
            <Camera className="h-5 w-5" />
            {showCamera ? "Hide Camera" : "Open Camera"}
          </button>
          <button
            type="button"
            data-ocid="task_verify.upload_button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 font-medium text-sm text-foreground transition-smooth hover:bg-muted"
          >
            <Upload className="h-5 w-5" />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
        <p className="px-4 pb-3 text-center text-xs text-muted-foreground">
          {photos.length} photo{photos.length !== 1 ? "s" : ""} captured
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Verification Notes (optional)
        </Label>
        <Textarea
          data-ocid="task_verify.notes_textarea"
          placeholder="Add any observations about the property condition..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="rounded-xl resize-none"
        />
      </div>

      {/* Submit */}
      <div className="space-y-3">
        {!allChecked && (
          <p className="text-center text-xs text-amber-600">
            ⚠ Complete all checklist items before marking as verified
          </p>
        )}
        <Button
          type="button"
          data-ocid="task_verify.complete_button"
          onClick={() => completeMutation.mutate()}
          disabled={!allChecked || completeMutation.isPending || isUploading}
          className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold disabled:opacity-50"
        >
          {completeMutation.isPending || isUploading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isUploading
                ? `Uploading photo ${(uploadingPhotoIdx ?? 0) + 1}/${photos.length}...`
                : "Completing..."}
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Verified &amp;
              Complete
            </>
          )}
        </Button>
      </div>

      {completeMutation.isSuccess && (
        <div
          data-ocid="task_verify.success_state"
          className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-4 text-emerald-700"
        >
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold">Verification Complete!</span>
        </div>
      )}
    </div>
  );
}
