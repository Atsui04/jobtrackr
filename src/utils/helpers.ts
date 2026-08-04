import type { Job } from "../types/job";

export function filterJobs(jobs: Job[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return jobs;

  return jobs.filter(
    (job) =>
      job.company.toLowerCase().includes(normalizedQuery) ||
      job.position.toLowerCase().includes(normalizedQuery)
  );
}
