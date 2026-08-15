import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type SubmitEvent,
} from "react";
import type { Job, NewJob } from "../types/job";

import { X } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface JobFormProps {
  onClose: () => void;
  onAddJob: (job: NewJob) => Promise<void>;
  onEditJob: (
    jobId: string,
    updates: Partial<Omit<Job, "id" | "created_at">>
  ) => Promise<void>;
  initialData?: Job;
}

const jobSchema = z.object({
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  link: z.url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

function JobForm({ onClose, onAddJob, onEditJob, initialData }: JobFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mouseDownTargetRef = useRef<EventTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: initialData?.company ?? "",
      position: initialData?.position ?? "",
      link: initialData?.link ?? "",
      notes: initialData?.notes ?? "",
    },
  });

  useEffect(() => {
    dialogRef.current?.showModal();
    setFocus("company");
  }, [setFocus]);

  function requestClose() {
    dialogRef.current?.close();
  }

  function handleNativeClose() {
    onClose();
  }

  function handleMouseDown(e: MouseEvent<HTMLDialogElement>) {
    mouseDownTargetRef.current = e.target;
  }

  function handleBackdropClick(e: MouseEvent<HTMLDialogElement>) {
    if (
      e.target === dialogRef.current &&
      mouseDownTargetRef.current === dialogRef.current
    ) {
      requestClose();
    }
  }

  async function onSubmit(data: JobFormValues) {
    const values = {
      company: data.company,
      position: data.position,
      link: data.link || null,
      notes: data.notes || null,
    };

    try {
      setError(null);

      if (initialData) {
        await onEditJob(initialData.id, values);
      } else {
        await onAddJob({
          ...values,
          status: "applied",
          applied_date: new Date().toISOString().split("T")[0],
        });
      }

      requestClose();
    } catch {
      setError("Failed to save the job opening. Please try again.");
    }
  }

  async function handleFormSubmit(e: SubmitEvent<HTMLFormElement>) {
    return handleSubmit(onSubmit)(e);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onMouseDown={handleMouseDown}
      onClick={handleBackdropClick}
      className="fixed top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border-none bg-white p-6 shadow-xl outline-none backdrop:bg-black/50"
    >
      <form
        onSubmit={handleFormSubmit}
        className="text-ink flex flex-col gap-4 font-sans"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">
            {initialData ? "Edit Job" : "Add Job"}
          </h2>
          <button
            aria-label="Close"
            type="button"
            onClick={requestClose}
            className="focus-visible:ring-signal cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <X size={16} aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-1 font-light">
          <label htmlFor="company" className="text-xs">
            Company *
          </label>
          <input
            {...register("company")}
            type="text"
            id="company"
            placeholder="Google"
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          />
          <span className="text-wine block min-h-4 text-xs">
            {errors.company?.message}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="position" className="text-xs font-light">
            Position *
          </label>
          <input
            {...register("position")}
            type="text"
            id="position"
            placeholder="Frontend developer"
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          />
          <span className="text-wine block min-h-4 text-xs">
            {errors.position?.message}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="link" className="text-xs font-light">
            Link
          </label>
          <input
            {...register("link")}
            type="text"
            id="link"
            placeholder="https://..."
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          />
          {errors.link && (
            <span className="text-wine text-xs">{errors.link.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-xs font-light">
            Notes
          </label>
          <textarea
            {...register("notes")}
            id="notes"
            placeholder="Recruiter contacts, details..."
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          ></textarea>
          {error && <p className="text-wine text-xs">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-6">
          <button
            onClick={requestClose}
            type="button"
            className="focus-visible:ring-signal cursor-pointer rounded-lg px-4 py-2 font-light outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-signal focus-visible:ring-signal cursor-pointer rounded-lg px-4 py-2 text-white outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {initialData
              ? isSubmitting
                ? "Editing"
                : "Edit"
              : isSubmitting
                ? "Adding..."
                : "Add"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default JobForm;
