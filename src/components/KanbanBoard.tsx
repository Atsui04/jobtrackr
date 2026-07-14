import { DragDropProvider } from "@dnd-kit/react";
import type { Job, JobStatus } from "../types/job";
import { STATUSES } from "../utils/constants";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  jobs: Job[];
  onMoveJob: (jobId: string, newStatus: JobStatus) => void;
}

function KanbanBoard({ jobs, onMoveJob }: KanbanBoardProps) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-start w-full mt-6">
        {STATUSES.map(({ value, label }) => (
          <KanbanColumn
            key={value}
            status={value}
            label={label}
            jobs={jobs.filter((j) => j.status === value)}
          />
        ))}
      </div>
    </DragDropProvider>
  );
}

export default KanbanBoard;
