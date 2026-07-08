import { supabase } from "./supabase";
import type { Job, JobStatus, NewJob } from "../types/job";

export async function getJobs(): Promise<Job[]> {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addJob(job: NewJob): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert(job)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateJob(id: string, status: JobStatus): Promise<void> {
  const { error } = await supabase.from("jobs").update({ status }).eq("id", id);

  if (error) throw error;
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from("jobs").delete().eq("id", id);

  if (error) throw error;
}
