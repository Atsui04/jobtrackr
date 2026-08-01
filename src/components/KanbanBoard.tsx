import { DragDropProvider } from "@dnd-kit/react";
import type { Job, JobStatus } from "../types/job";
import { STATUSES } from "../utils/constants";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  jobs: Job[];
  onMoveJob: (jobId: string, newStatus: JobStatus) => void;
  onDeleteJob: (jobId: string) => void;
}

function KanbanBoard({ jobs, onMoveJob, onDeleteJob }: KanbanBoardProps) {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return;

        const jobId = event.operation.source?.id;
        const newStatus = event.operation.target?.id;

        if (!jobId || !newStatus) return;

        onMoveJob(jobId as string, newStatus as JobStatus);
      }}
    >
      <div className="mt-6 grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 md:grid-cols-5">
        {STATUSES.map(({ value, label }) => (
          <KanbanColumn
            key={value}
            status={value}
            label={label}
            jobs={jobs.filter((j) => j.status === value)}
            onDeleteJob={onDeleteJob}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}

export default KanbanBoard;
