import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import JobCard from "./JobCard";
import type { Job } from "../types/job";

describe("JobCard Component", () => {
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

  it("should render company name and position", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("should not render the link when job.link is missing", () => {
    render(<JobCard job={mockJob} />);

    expect(screen.queryByText("Vacancy link")).not.toBeInTheDocument();
  });

  it("should render the link when the job.link is provided", () => {
    const jobWithLink = { ...mockJob, link: "https://google.com" };
    render(<JobCard job={jobWithLink} />);

    expect(screen.getByText("Vacancy link")).toBeInTheDocument();
  });
});
