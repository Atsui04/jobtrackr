export type JobStatus =
  | "applied"
  | "screening"
  | "interview"
  | "offer"
  | "rejected";

export type Job = {
  id: string;
  company: string;
  position: string;
  status: JobStatus;
  appliedDate: string | null;
  link: string | null;
  notes: string | null;
  createdAt: string;
};

export type NewJob = Omit<Job, "id" | "createdAt">;
