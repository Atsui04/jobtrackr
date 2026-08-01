import { useDraggable } from "@dnd-kit/react";
import type { Job } from "../types/job";

import { Trash2 } from "lucide-react";

interface JobCardProps {
  job: Job;
  onDeleteJob: (jobId: string) => void;
}

function JobCard({ job, onDeleteJob }: JobCardProps) {
  const { ref, isDragging } = useDraggable({
    id: job.id,
  });

  return (
    <div
      ref={ref}
      className={`group bg-paper hover:bg-paper/70 flex cursor-pointer flex-col gap-1 rounded-lg p-3.5 transition-all ${
        isDragging ? "scale-105 rotate-1 opacity-90 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-ink text-sm leading-snug font-semibold">
          {job.company}
        </h3>
        <button
          aria-label="Delete job"
          onClick={() => onDeleteJob(job.id)}
          className="text-ink/40 hover:text-wine pointer-events-none cursor-pointer opacity-0 transition-all duration-200 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100"
        >
          <Trash2 size={16} aria-hidden />
        </button>
      </div>
      <p className="text-ink/70 text-xs font-light">{job.position}</p>

      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="text-signal mt-1 max-w-full truncate text-[11px] hover:underline"
        >
          Vacancy link
        </a>
      )}

      <div className="border-ink/10 mt-2 flex items-center justify-between border-t pt-2">
        <span className="text-ink/40 font-mono text-[10px]">
          {job.applied_date}
        </span>
      </div>
    </div>
  );
}

export default JobCard;
