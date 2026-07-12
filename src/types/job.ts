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
  applied_date: string | null;
  link: string | null;
  notes: string | null;
  created_at: string;
};

export type NewJob = Omit<Job, "id" | "created_at">;
