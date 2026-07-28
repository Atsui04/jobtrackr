import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KanbanColumn from "./KanbanColumn";
import { DragDropProvider } from "@dnd-kit/react";
import type { Job } from "../types/job";

function renderColumn(ui: React.ReactNode) {
  return render(<DragDropProvider>{ui}</DragDropProvider>);
}

describe("KanbanColumn component", () => {
  it("renders 'No jobs yet' when jobs array is empty", () => {
    renderColumn(<KanbanColumn status="applied" label="Applied" jobs={[]} />);

    expect(screen.getByText("No jobs yet")).toBeInTheDocument();
  });

  it("renders correct number of jobs", () => {
    const mockJobs: Job[] = [
      {
        id: "1",
        company: "Google",
        position: "Frontend Developer",
        status: "applied",
        applied_date: "2026-07-28",
        link: null,
        notes: null,
        created_at: "2026-07-28T10:00:00Z",
      },
      {
        id: "2",
        company: "Amazon",
        position: "Backend Developer",
        status: "interview",
        applied_date: "2026-07-26",
        link: null,
        notes: null,
        created_at: "2026-07-26T10:00:00Z",
      },
      {
        id: "3",
        company: "SoftServe",
        position: "Software Engineer",
        status: "offer",
        applied_date: "2026-07-25",
        link: null,
        notes: null,
        created_at: "2026-07-25T10:00:00Z",
      },
    ];

    renderColumn(
      <KanbanColumn status="applied" label="Applied" jobs={mockJobs} />,
    );

    expect(screen.queryByText("No jobs yet")).not.toBeInTheDocument();
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Amazon")).toBeInTheDocument();
    expect(screen.getByText("SoftServe")).toBeInTheDocument();
  });
});
