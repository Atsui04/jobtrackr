import { DragDropProvider } from "@dnd-kit/react";
import type { Job, JobStatus } from "../types/job";
import { STATUSES } from "../utils/constants";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  jobs: Job[];
  onMoveJob: (jobId: string, newStatus: JobStatus) => Promise<void>;
  onDeleteJob: (jobId: string) => Promise<void>;
  onCardClick: (job: Job) => void;
}

function KanbanBoard({
  jobs,
  onMoveJob,
  onDeleteJob,
  onCardClick,
}: KanbanBoardProps) {
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
      <div className="mt-6 flex w-full flex-nowrap items-start gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:overflow-x-visible">
        {STATUSES.map(({ value, label }) => (
          <KanbanColumn
            key={value}
            status={value}
            label={label}
            jobs={jobs.filter((j) => j.status === value)}
            onDeleteJob={onDeleteJob}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}

export default KanbanBoard;
