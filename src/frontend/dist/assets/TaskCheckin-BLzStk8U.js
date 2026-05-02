import { l as useParams, a as useNavigate, d as useActor, m as useQueryClient, r as reactExports, w as DocType, e as useQuery, D as DecisionStatus, n as useMutation, j as jsxRuntimeExports, b as ue, L as LoaderCircle, X, E as ExternalBlob, v as UploadedBy, Y as TaskStatus, f as createActor } from "./index-Dtbu2WTs.js";
import { B as Button } from "./button-zPdDuQnJ.js";
import { L as Label } from "./label-CKhum0p5.js";
import { u as useCamera, C as CameraOff } from "./useCamera-BATNc_fe.js";
import { A as ArrowLeft } from "./arrow-left-BDd94EwB.js";
import { T as TriangleAlert } from "./triangle-alert-aMZ_vyq4.js";
import { C as Check } from "./check-yaw8C9ek.js";
import { R as RefreshCw } from "./refresh-cw-BpInm9Ln.js";
import { F as FileText } from "./file-text-2x1X94gD.js";
import { C as Camera } from "./camera-CIse_KJh.js";
import { R as RefreshCcw } from "./refresh-ccw-B7jBZzVr.js";
import { C as CircleCheck } from "./circle-check-B7IaRigW.js";
import { U as Upload } from "./upload-LY-80_KF.js";
import "./index-fYYCyfxq.js";
const DOC_TYPE_LABELS = {
  [DocType.aadhaar]: "Aadhaar Card",
  [DocType.passport]: "Passport",
  [DocType.drivingLicense]: "Driving License",
  [DocType.other]: "Other ID"
};
function TaskCheckin() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { actor, isFetching } = useActor(createActor);
  const qc = useQueryClient();
  const [docType, setDocType] = reactExports.useState(DocType.aadhaar);
  const [idPhoto, setIdPhoto] = reactExports.useState(null);
  const [showCamera, setShowCamera] = reactExports.useState(false);
  const [docUploaded, setDocUploaded] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const { data: tasks } = useQuery({
    queryKey: ["myTasks"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTasks();
    },
    enabled: !!actor && !isFetching
  });
  const task = tasks == null ? void 0 : tasks.find((t) => String(t.id) === id);
  const bookingId = (task == null ? void 0 : task.bookingId) ? String(task.bookingId) : null;
  const { data: booking } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      if (!actor || !bookingId) return null;
      return actor.getBooking(BigInt(bookingId));
    },
    enabled: !!actor && !!bookingId && !isFetching,
    refetchInterval: 3e4
  });
  const isInDecisionWindow = booking && booking.decisionStatus === DecisionStatus.pending && Date.now() < Number(booking.decisionDeadline) / 1e6;
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
    ue.success("ID photo captured!");
  };
  const handleFileInput = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setIdPhoto({ file, preview });
    ue.success("ID photo selected!");
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
        uploadedBy: UploadedBy.executive
      });
    },
    onSuccess: () => {
      ue.success("ID document uploaded successfully!");
      setDocUploaded(true);
    },
    onError: () => ue.error("Failed to upload document")
  });
  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (idPhoto && !docUploaded) {
        const bytes = await idPhoto.file.arrayBuffer();
        const blob = ExternalBlob.fromBytes(new Uint8Array(bytes));
        if (bookingId) {
          await actor.createDocument({
            bookingId: BigInt(bookingId),
            fileBlob: blob,
            docType,
            uploadedBy: UploadedBy.executive
          });
        }
      }
      await actor.updateTaskStatus(
        BigInt(id),
        TaskStatus.completed,
        "Check-in completed"
      );
    },
    onSuccess: () => {
      ue.success("Check-in completed successfully!");
      qc.invalidateQueries({ queryKey: ["myTasks"] });
      navigate({ to: "/executive/tasks" });
    },
    onError: (err) => ue.error(err.message || "Failed to complete check-in")
  });
  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !bookingId) throw new Error("No booking");
      return actor.processDecision(BigInt(bookingId), DecisionStatus.refunded);
    },
    onSuccess: () => {
      ue.success("Refund processed — 90% returned to customer");
      qc.invalidateQueries({ queryKey: ["booking", bookingId] });
      qc.invalidateQueries({ queryKey: ["myTasks"] });
    },
    onError: () => ue.error("Failed to process refund")
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 pb-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/executive/task/$id", params: { id } }),
          "data-ocid": "task_checkin.back_button",
          className: "flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card transition-smooth hover:bg-muted",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold", children: "Customer Check-in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Task #",
          id
        ] })
      ] })
    ] }),
    bookingId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card px-4 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Linked Booking" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 font-semibold", children: [
        "Booking #",
        bookingId
      ] }),
      booking && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Check-in:",
          " ",
          new Date(
            Number(booking.checkIn) / 1e6
          ).toLocaleDateString("en-IN")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          String(booking.totalDays),
          " days"
        ] })
      ] })
    ] }),
    isInDecisionWindow && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-amber-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-amber-800 text-sm", children: "Decision Window Active" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-amber-700", children: "Customer is within the 15–30 min decision window. Process refund if they are not satisfied." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            "data-ocid": "task_checkin.continue_stay_button",
            onClick: () => actor && bookingId && actor.processDecision(BigInt(bookingId), DecisionStatus.accepted).then(() => {
              ue.success("Stay confirmed!");
              qc.invalidateQueries({ queryKey: ["booking", bookingId] });
            }).catch(() => ue.error("Failed to confirm stay")),
            className: "h-12 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1 h-4 w-4" }),
              " Continue Stay"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            "data-ocid": "task_checkin.refund_button",
            onClick: () => refundMutation.mutate(),
            disabled: refundMutation.isPending,
            variant: "outline",
            className: "h-12 rounded-xl border-amber-400 text-amber-700 font-semibold hover:bg-amber-50",
            children: refundMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-1 h-4 w-4" }),
              " Process Refund"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-amber-600", children: "Refund = 90% returned, 10% platform fee retained" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm", children: "ID Document Collection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Capture customer's government-issued ID" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Document Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 grid grid-cols-2 gap-2", children: Object.keys(DOC_TYPE_LABELS).map((dt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": `task_checkin.doc_type.${dt}`,
            onClick: () => setDocType(dt),
            className: `flex items-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-medium transition-smooth ${docType === dt ? "border-primary bg-primary/5 text-primary" : "border-border bg-background text-muted-foreground hover:border-primary/40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 shrink-0" }),
              DOC_TYPE_LABELS[dt]
            ]
          },
          dt
        )) })
      ] }),
      showCamera && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 bg-black", children: [
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
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-4 text-center text-sm", children: camError })
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
              "data-ocid": "task_checkin.capture_button",
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
      idPhoto && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-4 mt-3 overflow-hidden rounded-xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: idPhoto.preview,
            alt: "ID Document",
            className: "h-48 w-full object-cover"
          }
        ),
        docUploaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-emerald-500/70", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-10 w-10 text-white" }) }),
        !docUploaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setIdPhoto(null),
            className: "absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "task_checkin.camera_button",
            onClick: handleToggleCamera,
            className: "flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-primary/5 font-semibold text-primary transition-smooth hover:bg-primary/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
              showCamera ? "Hide Camera" : "Scan ID"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            "data-ocid": "task_checkin.upload_button",
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
      idPhoto && !docUploaded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          "data-ocid": "task_checkin.upload_doc_button",
          onClick: () => uploadDocMutation.mutate(),
          disabled: uploadDocMutation.isPending,
          variant: "outline",
          className: "h-12 w-full rounded-xl border-primary text-primary font-semibold",
          children: uploadDocMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            " Uploading Document..."
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
            " Upload Document to System"
          ] })
        }
      ) }),
      docUploaded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "task_checkin.success_state",
          className: "mx-4 mb-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-emerald-700",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: "Document uploaded securely" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "button",
        "data-ocid": "task_checkin.complete_button",
        onClick: () => completeMutation.mutate(),
        disabled: completeMutation.isPending || !idPhoto,
        className: "h-14 w-full rounded-2xl bg-primary text-primary-foreground text-base font-bold disabled:opacity-50",
        children: completeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
          " Completing..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mr-2 h-5 w-5" }),
          " Mark Check-in Complete"
        ] })
      }
    ),
    !idPhoto && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-muted-foreground", children: "Capture or upload customer's ID before completing check-in" }),
    completeMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "task_checkin.error_state",
        className: "flex items-center justify-center gap-2 rounded-2xl bg-red-50 py-3 text-red-700",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Failed to complete check-in. Retry." })
        ]
      }
    )
  ] });
}
export {
  TaskCheckin as default
};
