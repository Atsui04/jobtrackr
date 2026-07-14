import { useDroppable } from "@dnd-kit/react";
import type { Job, JobStatus } from "../types/job";
import { STATUS_STRIPE } from "../utils/constants";
import JobCard from "./JobCard";

interface KanbanColumnProps {
  status: JobStatus;
  label: string;
  jobs: Job[];
}

function KanbanColumn({ status, label, jobs }: KanbanColumnProps) {
  const { ref } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={ref}
      className="flex flex-col bg-white rounded-xl shadow-sm border border-ink/10 overflow-hidden min-w-50"
    >
      <div className={`h-1.5 w-full ${STATUS_STRIPE[status]}`} />
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-center text-xs font-semibold text-ink/70 mb-4">
          <h2>{label}</h2>
          {jobs.length > 0 && (
            <span className="bg-paper text-ink/60 px-2 py-0.5 rounded-full text-[10px]">
              {jobs.length}
            </span>
          )}
        </div>
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-ink/10 rounded-lg py-8 px-2 flex-1">
            <p className="text-xs text-ink/40 text-center">No jobs yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;
