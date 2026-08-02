import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import JobCard from "./JobCard";
import type { Job } from "../types/job";
import type { ComponentProps } from "react";

const mockJob: Job = {
  id: "1",
  company: "Google",
  position: "Frontend Developer",
  status: "applied",
  applied_date: "2026-07-27",
  link: null,
  notes: null,
  created_at: "2026-07-27T10:00:00Z",
};

function renderJobCard(
  overrides: Partial<ComponentProps<typeof JobCard>> = {}
) {
  return render(
    <JobCard
      job={mockJob}
      onDeleteJob={vi.fn()}
      onCardClick={vi.fn()}
      {...overrides}
    />
  );
}

describe("JobCard Component", () => {
  it("should render company name and position", () => {
    renderJobCard();

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("should not render the link when job.link is missing", () => {
    renderJobCard();

    expect(screen.queryByText("Vacancy link")).not.toBeInTheDocument();
  });

  it("should render the link when the job.link is provided", () => {
    renderJobCard({ job: { ...mockJob, link: "https://google.com" } });

    expect(screen.getByText("Vacancy link")).toBeInTheDocument();
  });
});
