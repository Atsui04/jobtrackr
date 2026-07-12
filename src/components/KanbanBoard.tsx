import type { Job } from "../types/job";
import { STATUSES } from "../utils/constants";
import KanbanColumn from "./KanbanColumn";

interface KanbanBoardProps {
  jobs: Job[];
}

function KanbanBoard({ jobs }: KanbanBoardProps) {
  return (
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
  );
}

export default KanbanBoard;
