import { useDroppable } from "@dnd-kit/react";
import type { Job, JobStatus } from "../types/job";
import { STATUS_STRIPE } from "../utils/constants";
import JobCard from "./JobCard";

interface KanbanColumnProps {
  status: JobStatus;
  label: string;
  jobs: Job[];
  onDeleteJob: (jobId: string) => Promise<void>;
  onCardClick: (job: Job) => void;
}

function KanbanColumn({
  status,
  label,
  jobs,
  onDeleteJob,
  onCardClick,
}: KanbanColumnProps) {
  const { ref } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={ref}
      className="border-ink/10 flex w-70 shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm lg:w-full lg:min-w-0"
    >
      <div className={`h-1.5 w-full ${STATUS_STRIPE[status]}`} />
      <div className="flex flex-1 flex-col p-4">
        <div className="text-ink/70 mb-4 flex items-center justify-between text-xs font-semibold">
          <h2>{label}</h2>
          {jobs.length > 0 && (
            <span className="bg-paper text-ink/60 rounded-full px-2 py-0.5 text-[10px]">
              {jobs.length}
            </span>
          )}
        </div>
        {jobs.length === 0 ? (
          <div className="border-ink/10 flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed px-2 py-8">
            <p className="text-ink/40 text-center text-xs">No jobs yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDeleteJob={onDeleteJob}
                onCardClick={onCardClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;
