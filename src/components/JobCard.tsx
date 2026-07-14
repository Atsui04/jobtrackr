import { useDraggable } from "@dnd-kit/react";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
  const { ref, isDragging } = useDraggable({
    id: job.id,
  });

  return (
    <div
      ref={ref}
      className={`bg-paper rounded-lg p-3.5 transition-all cursor-pointer flex flex-col gap-1 hover:bg-paper/70 ${
        isDragging ? "shadow-lg scale-105 rotate-1 opacity-90" : ""
      }`}
    >
      <h3 className="text-sm font-semibold text-ink leading-snug">
        {job.company}
      </h3>
      <p className="text-xs text-ink/70 font-light">{job.position}</p>

      {job.link && (
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-signal hover:underline mt-1 truncate max-w-full"
        >
          Vacancy link
        </a>
      )}

      <div className="flex justify-between items-center mt-2 pt-2 border-t border-ink/10">
        <span className="font-mono text-[10px] text-ink/40">
          {job.applied_date}
        </span>
      </div>
    </div>
  );
}

export default JobCard;
