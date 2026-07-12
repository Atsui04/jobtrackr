import { useEffect, useRef, useState } from "react";
import type { SubmitEvent } from "react";
import closeIcon from "../assets/icons/cancel-svgrepo-com.svg";
import type { NewJob } from "../types/job";

interface JobFormProps {
  onClose: () => void;
  onAddJob: (job: NewJob) => Promise<void>;
}

function JobForm({ onClose, onAddJob }: JobFormProps) {
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

    const newJob: NewJob = {
      company: formData.get("company") as string,
      position: formData.get("position") as string,
      status: "applied",
      applied_date: new Date().toISOString().split("T")[0],
      link: (formData.get("link") as string) || null,
      notes: (formData.get("notes") as string) || null,
    };

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddJob(newJob);
      requestClose();
    } catch {
      setError("Failed to add the job opening. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onClick={(e) => e.target === dialogRef.current && requestClose()}
      className="fixed inset-0 m-auto bg-white rounded-xl p-6 backdrop:bg-black/50 border-none outline-none shadow-xl max-w-md w-full"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 font-sans text-ink"
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-display">Add Job</h2>
          <button
            type="button"
            onClick={requestClose}
            className="cursor-pointer focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-full outline-none"
          >
            <img
              src={closeIcon}
              alt="Close dialog button"
              className="w-4 h-4"
            />
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
            className="py-2 px-3 bg-paper rounded-md outline-none focus:ring-2 focus:ring-signal"
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
            className="py-2 px-3 bg-paper rounded-md outline-none focus:ring-2 focus:ring-signal"
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
            className="py-2 px-3 bg-paper rounded-md outline-none focus:ring-2 focus:ring-signal"
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
            className="py-2 px-3 bg-paper rounded-md outline-none focus:ring-2 focus:ring-signal"
          ></textarea>
        </div>

        {error && <p className="text-wine text-xs">{error}</p>}

        <div className="flex items-center gap-6 justify-end">
          <button
            onClick={requestClose}
            type="button"
            className="py-2 px-4 font-light cursor-pointer rounded-lg focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2 px-4 text-paper bg-signal rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default JobForm;
