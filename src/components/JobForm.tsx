import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import type { Job, NewJob } from "../types/job";

import { X } from "lucide-react";

interface JobFormProps {
  onClose: () => void;
  onAddJob: (job: NewJob) => Promise<void>;
  onEditJob: (
    jobId: string,
    updates: Partial<Omit<Job, "id" | "created_at">>
  ) => Promise<void>;
  initialData?: Job;
}

function JobForm({ onClose, onAddJob, onEditJob, initialData }: JobFormProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const companyInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
    companyInputRef.current?.focus();
  }, []);

  function requestClose() {
    dialogRef.current?.close();
  }

  function handleNativeClose() {
    onClose();
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const values = {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      link: (formData.get("link") as string) || null,
      notes: (formData.get("notes") as string) || null,
    };

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onClick={(e) => e.target === dialogRef.current && requestClose()}
      className="fixed inset-0 m-auto w-full max-w-md rounded-xl border-none bg-white p-6 shadow-xl outline-none backdrop:bg-black/50"
    >
      <form
        onSubmit={handleSubmit}
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
            ref={companyInputRef}
            required
            type="text"
            name="company"
            id="company"
            placeholder="Google"
            defaultValue={initialData?.company}
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="position" className="text-xs font-light">
            Position *
          </label>
          <input
            required
            type="text"
            name="position"
            id="position"
            placeholder="Frontend developer"
            defaultValue={initialData?.position}
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="link" className="text-xs font-light">
            Link
          </label>
          <input
            type="text"
            name="link"
            id="link"
            placeholder="https://..."
            defaultValue={initialData?.link ?? undefined}
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="notes" className="text-xs font-light">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            placeholder="Recruiter contacts, details..."
            defaultValue={initialData?.notes ?? undefined}
            className="bg-paper focus:ring-signal rounded-md px-3 py-2 outline-none focus:ring-2"
          ></textarea>
        </div>

        {error && <p className="text-wine text-xs">{error}</p>}

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
            className="text-paper bg-signal focus-visible:ring-signal cursor-pointer rounded-lg px-4 py-2 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
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
