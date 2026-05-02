import { l as useParams, a as useNavigate, d as useActor, m as useQueryClient, r as reactExports, n as useMutation, j as jsxRuntimeExports, L as LoaderCircle, X, b as ue, Y as TaskStatus, E as ExternalBlob, f as createActor } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { L as Label } from "./label-CKhum0p5.js";
import { T as Textarea } from "./textarea-DCEjf_28.js";
import { u as useCamera, C as CameraOff } from "./useCamera-BATNc_fe.js";
import { A as ArrowLeft } from "./arrow-left-BDd94EwB.js";
import { C as Check } from "./check-yaw8C9ek.js";
import { C as Camera } from "./camera-CIse_KJh.js";
import { R as RefreshCcw } from "./refresh-ccw-B7jBZzVr.js";
import { U as Upload } from "./upload-LY-80_KF.js";
import { C as CircleCheck } from "./circle-check-B7IaRigW.js";
import "./index-fYYCyfxq.js";
const CHECKLIST = [
  { key: "location", label: "Location confirmed on-site" },
  { key: "condition", label: "Property condition verified" },
  { key: "photos", label: "Owner photos match actual rooms" },
  { key: "owner", label: "Owner identity verified" }
];
function TaskVerify() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  const [checks, setChecks] = reactExports.useState({});
  const [notes, setNotes] = reactExports.useState("");
  const [photos, setPhotos] = reactExports.useState([]);
  const [uploadingPhotoIdx, setUploadingPhotoIdx] = reactExports.useState(
    null
  );
  const [uploadedCount, setUploadedCount] = reactExports.useState(0);
  const [showCamera, setShowCamera] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const {
    isActive,
    isLoading: camLoading,
    error: camError,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    videoRef,
    canvasRef
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
    ue.success("Photo captured!");
  };
  const handleFileInput = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos((prev) => [...prev, { file, preview }]);
    ue.success("Photo added!");
  };
  const removePhoto = (idx) => {
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
        ue.error(`Failed to upload photo ${i + 1}`);
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
        notes.trim() || null
      );
    },
    onSuccess: () => {
      ue.success("Property verified and task completed!");
      qc.invalidateQueries({ queryKey: ["myTasks"] });
      navigate({ to: "/executive/tasks" });
    },
    onError: (err) => ue.error(err.message || "Failed to complete task")
  });
  const isUploading = uploadingPhotoIdx !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/executive/task/$id", params: { id } }),
          "data-ocid": "task_verify.back_button",
          className: "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-smooth hover:bg-muted",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Property Verification" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Task #",
          id
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: "Verification Checklist" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Complete all items before marking verified" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border", children: CHECKLIST.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          "data-ocid": `task_verify.check.${item.key}`,
          className: "flex cursor-pointer items-center gap-3 px-4 py-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-smooth ${checks[item.key] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`,
                children: checks[item.key] && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm ${checks[item.key] ? "text-foreground" : "text-muted-foreground"}`,
                children: item.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                className: "sr-only",
                checked: !!checks[item.key],
                onChange: (e) => setChecks((prev) => ({
                  ...prev,
                  [item.key]: e.target.checked
                }))
              }
            )
          ]
        },
        item.key
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: "Property Photos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Capture real on-site photos for verification" })
      ] }),
      showCamera && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-black", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full", style: { aspectRatio: "4/3" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              className: "h-full w-full object-cover",
              playsInline: true,
              muted: true,
              autoPlay: true
            }
          ),
          camLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-white" }) }),
          camError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CameraOff, { className: "h-8 w-8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-center px-4", children: camError })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-4 bg-black px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleToggleCamera,
              className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "task_verify.capture_button",
              onClick: handleCapture,
              disabled: !isActive || camLoading,
              className: "flex h-16 w-16 items-center justify-center rounded-full bg-white disabled:opacity-50",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-7 w-7 text-black" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => switchCamera(),
              className: "flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { className: "h-5 w-5" })
            }
          )
        ] })
      ] }),
      photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2 p-3", children: photos.map((photo, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative aspect-square overflow-hidden rounded-xl",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: photo.preview,
                alt: `Captured ${i + 1}`,
                className: "h-full w-full object-cover"
              }
            ),
            uploadedCount > i ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-emerald-500/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-6 w-6 text-white" }) }) : uploadingPhotoIdx === i ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-black/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-white" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => removePhoto(i),
                className: "absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ]
        },
        photo.preview
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "task_verify.camera_button",
            onClick: handleToggleCamera,
            className: "flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 font-semibold text-primary transition-smooth hover:bg-primary/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
              showCamera ? "Hide Camera" : "Open Camera"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "task_verify.upload_button",
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            className: "flex h-14 items-center justify-center gap-2 rounded-xl border border-border bg-muted/30 font-medium text-sm text-foreground transition-smooth hover:bg-muted",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-5 w-5" }),
              "Upload File"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: "image/*",
            className: "hidden",
            onChange: handleFileInput
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-4 pb-3 text-center text-xs text-muted-foreground", children: [
        photos.length,
        " photo",
        photos.length !== 1 ? "s" : "",
        " captured"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-semibold", children: "Verification Notes (optional)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          "data-ocid": "task_verify.notes_textarea",
          placeholder: "Add any observations about the property condition...",
          value: notes,
          onChange: (e) => setNotes(e.target.value),
          rows: 3,
          className: "rounded-xl resize-none"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      !allChecked && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-amber-600", children: "⚠ Complete all checklist items before marking as verified" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          "data-ocid": "task_verify.complete_button",
          onClick: () => completeMutation.mutate(),
          disabled: !allChecked || completeMutation.isPending || isUploading,
          className: "h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold disabled:opacity-50",
          children: completeMutation.isPending || isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
            isUploading ? `Uploading photo ${(uploadingPhotoIdx ?? 0) + 1}/${photos.length}...` : "Completing..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-2 h-5 w-5" }),
            " Mark Verified & Complete"
          ] })
        }
      )
    ] }),
    completeMutation.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "task_verify.success_state",
        className: "flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-4 text-emerald-700",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "Verification Complete!" })
        ]
      }
    )
  ] });
}
export {
  TaskVerify as default
};
