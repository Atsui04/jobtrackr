import { describe, expect, it } from "vitest";
import { filterJobs } from "./helpers";
import type { Job } from "../types/job";

describe("Filter Jobs", () => {
  const mockJobs: Job[] = [
    {
      id: "1",
      company: "Google",
      position: "Junior Frontend Developer",
      status: "applied",
      applied_date: "2026-08-15",
      link: null,
      notes: null,
      created_at: "2026-07-27T10:00:00Z",
    },
    {
      id: "2",
      company: "Amazon",
      position: "Middle Frontend Developer",
      status: "applied",
      applied_date: "2026-08-15",
      link: null,
      notes: null,
      created_at: "2026-07-27T10:00:00Z",
    },
    {
      id: "3",
      company: "Meta",
      position: "Senior Frontend Developer",
      status: "applied",
      applied_date: "2026-08-15",
      link: null,
      notes: null,
      created_at: "2026-07-27T10:00:00Z",
    },
  ];

  it("returns all jobs if search query is empty", () => {
    expect(filterJobs(mockJobs, "")).toEqual(mockJobs);
  });

  it("filters by company name, case-insensitive", () => {
    expect(filterJobs(mockJobs, "GOOGLE")).toHaveLength(1);
  });

  it("filters by position name", () => {
    expect(filterJobs(mockJobs, "junior")).toHaveLength(1);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterJobs(mockJobs, "xyz")).toHaveLength(0);
  });
});
