import type { JobStatus } from "../types/job";

export const STATUSES: { value: JobStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "screening", label: "Screening" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export const STATUS_STRIPE: Record<JobStatus, string> = {
  applied: "bg-ink/20",
  screening: "bg-amber",
  interview: "bg-signal",
  offer: "bg-sage",
  rejected: "bg-wine",
};
