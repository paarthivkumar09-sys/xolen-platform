import { ExternalBlob, createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCamera } from "@/hooks/useCamera";
import { DecisionStatus, DocType, TaskStatus, UploadedBy } from "@/types";
import type { Booking, VerificationTask } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Camera,
  CameraOff,
  Check,
  CheckCircle2,
  FileText,
  Loader2,
  RefreshCcw,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const DOC_TYPE_LABELS: Record<DocType, string> = {
  [DocType.aadhaar]: "Aadhaar Card",
  [DocType.passport]: "Passport",
  [DocType.drivingLicense]: "Driving License",
  [DocType.other]: "Other ID",
};

export default function TaskCheckin() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();

  const [docType, setDocType] = useState<DocType>(DocType.aadhaar);
  const [idPhoto, setIdPhoto] = useState<{
    file: File;
    preview: string;
  } | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [docUploaded, setDocUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load task to get booking id
  const { data: tasks } = useQuery<VerificationTask[]>({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching,
  });

  const task = tasks?.find((t) => String(t.id) === id);
  const bookingId = task?.bookingId ? String(task.bookingId) : null;

  // Load booking to check decision window
  const { data: booking } = useQuery<Booking | null>({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      return actor.getBooking(BigInt(bookingId));
    },
    enabled: !!actor && !!bookingId && !isFetching,
    refetchInterval: 30_000,
  });

  const isInDecisionWindow =
    booking &&
    booking.decisionStatus === DecisionStatus.pending &&
    Date.now() < Number(booking.decisionDeadline) / 1_000_000;

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
    setIdPhoto({ file, preview });
    stopCamera();
    setShowCamera(false);
    toast.success("ID photo captured!");
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setIdPhoto({ file, preview });
    toast.success("ID photo selected!");
  };

  const uploadDocMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !idPhoto || !bookingId)
        throw new Error("ID photo and booking required");
      const bytes = await idPhoto.file.arrayBuffer();
      const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
      await actor.createDocument({
        bookingId: BigInt(bookingId),
        fileBlob: blob,
        docType,
        uploadedBy: UploadedBy.executive,
      });
    },
    onSuccess: () => {
      toast.success("ID document uploaded successfully!");
      setDocUploaded(true);
    },
    onError: () => toast.error("Failed to upload document"),
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (idPhoto && !docUploaded) {
        // Upload doc first
        const bytes = await idPhoto.file.arrayBuffer();
        const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
        if (bookingId) {
          await actor.createDocument({
            bookingId: BigInt(bookingId),
            fileBlob: blob,
            docType,
            uploadedBy: UploadedBy.executive,
          });
        }
      }
      await actor.updateTaskStatus(
        BigInt(id),
        TaskStatus.completed,
        "Check-in completed",
      );
    },
    onSuccess: () => {
      toast.success("Check-in completed successfully!");
      qc.invalidateQueries({ queryKey: ["myTasks"] });
      navigate({ to: "/executive/tasks" });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to complete check-in"),
  });

  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !bookingId) throw new Error("No booking");
      return actor.processDecision(BigInt(bookingId), DecisionStatus.refunded);
    },
    onSuccess: () => {
      toast.success("Refund processed — 90% returned to customer");
      qc.invalidateQueries({ queryKey: ["booking", bookingId] });
      qc.invalidateQueries({ queryKey: ["myTasks"] });
    },
    onError: () => toast.error("Failed to process refund"),
  });

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            navigate({ to: "/executive/task/$id", params: { id } })
          }
          data-ocid="task_checkin.back_button"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-smooth hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold">Customer Check-in</h1>
          <p className="text-xs text-muted-foreground">Task #{id}</p>
        </div>
      </div>

      {/* Booking info */}
      {bookingId && (
        <div className="rounded-2xl border border-border bg-card px-4 py-3">
          <p className="text-xs text-muted-foreground">Linked Booking</p>
          <p className="mt-0.5 font-semibold">Booking #{bookingId}</p>
          {booking && (
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Check-in:{" "}
                {new Date(
                  Number(booking.checkIn) / 1_000_000,
                ).toLocaleDateString("en-IN")}
              </span>
              <span>·</span>
              <span>{String(booking.totalDays)} days</span>
            </div>
          )}
        </div>
      )}

      {/* Decision Window — Refund option */}
      {isInDecisionWindow && (
        <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <p className="font-semibold text-amber-800 text-sm">
              Decision Window Active
            </p>
          </div>
          <p className="text-xs text-amber-700">
            Customer is within the 15–30 min decision window. Process refund if
            they are not satisfied.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              data-ocid="task_checkin.continue_stay_button"
              onClick={() =>
                actor &&
                bookingId &&
                actor
                  .processDecision(BigInt(bookingId), DecisionStatus.accepted)
                  .then(() => {
                    toast.success("Stay confirmed!");
                    qc.invalidateQueries({ queryKey: ["booking", bookingId] });
                  })
                  .catch(() => toast.error("Failed to confirm stay"))
              }
              className="h-12 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              <Check className="mr-1 h-4 w-4" /> Continue Stay
            </Button>
            <Button
              type="button"
              data-ocid="task_checkin.refund_button"
              onClick={() => refundMutation.mutate()}
              disabled={refundMutation.isPending}
              variant="outline"
              className="h-12 rounded-xl border-amber-400 text-amber-700 font-semibold hover:bg-amber-50"
            >
              {refundMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="mr-1 h-4 w-4" /> Process Refund
                </>
              )}
            </Button>
          </div>
          <p className="text-center text-xs text-amber-600">
            Refund = 90% returned, 10% platform fee retained
          </p>
        </div>
      )}

      {/* ID Document Capture */}
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="font-semibold text-sm">ID Document Collection</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Capture customer's government-issued ID
          </p>
        </div>

        {/* Document type selector */}
        <div className="px-4 pt-4">
          <Label className="text-sm font-medium">Document Type</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((dt) => (
              <button
                key={dt}
                type="button"
                data-ocid={`task_checkin.doc_type.${dt}`}
                onClick={() => setDocType(dt)}
                className={`flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-smooth ${
                  docType === dt
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40"
                }`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                {DOC_TYPE_LABELS[dt]}
              </button>
            ))}
          </div>
        </div>

        {/* Camera preview */}
        {showCamera && (
          <div className="mt-3 bg-black">
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
                  <p className="px-4 text-center text-sm">{camError}</p>
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
                data-ocid="task_checkin.capture_button"
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

        {/* ID photo preview */}
        {idPhoto && (
          <div className="relative mx-4 mt-3 overflow-hidden rounded-xl">
            <img
              src={idPhoto.preview}
              alt="ID Document"
              className="h-48 w-full object-cover"
            />
            {docUploaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/70">
                <CheckCircle2 className="h-10 w-10 text-white" />
              </div>
            )}
            {!docUploaded && (
              <button
                type="button"
                onClick={() => setIdPhoto(null)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Camera / upload action buttons */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <button
            type="button"
            data-ocid="task_checkin.camera_button"
            onClick={handleToggleCamera}
            className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 font-semibold text-primary transition-smooth hover:bg-primary/10"
          >
            <Camera className="h-5 w-5" />
            {showCamera ? "Hide Camera" : "Scan ID"}
          </button>
          <button
            type="button"
            data-ocid="task_checkin.upload_button"
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

        {/* Separate upload doc button */}
        {idPhoto && !docUploaded && (
          <div className="px-4 pb-4">
            <Button
              type="button"
              data-ocid="task_checkin.upload_doc_button"
              onClick={() => uploadDocMutation.mutate()}
              disabled={uploadDocMutation.isPending}
              variant="outline"
              className="h-12 w-full rounded-xl border-primary text-primary font-semibold"
            >
              {uploadDocMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                  Document...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload Document to System
                </>
              )}
            </Button>
          </div>
        )}

        {docUploaded && (
          <div
            data-ocid="task_checkin.success_state"
            className="mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="text-sm font-semibold">
              Document uploaded securely
            </span>
          </div>
        )}
      </div>

      {/* Complete Check-in */}
      <Button
        type="button"
        data-ocid="task_checkin.complete_button"
        onClick={() => completeMutation.mutate()}
        disabled={completeMutation.isPending || !idPhoto}
        className="h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold disabled:opacity-50"
      >
        {completeMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Completing...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Check-in Complete
          </>
        )}
      </Button>

      {!idPhoto && (
        <p className="text-center text-xs text-muted-foreground">
          Capture or upload customer's ID before completing check-in
        </p>
      )}

      {completeMutation.isError && (
        <div
          data-ocid="task_checkin.error_state"
          className="flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-red-700"
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm font-medium">
            Failed to complete check-in. Retry.
          </span>
        </div>
      )}
    </div>
  );
}
