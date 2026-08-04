import { useEffect, useState } from "react";

import type { Job, JobStatus, NewJob } from "./types/job";
import type { ModalState } from "./types/modalState";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "./lib/supabase";
import { addJob, deleteJob, getJobs, updateJob } from "./lib/jobs";
import { signOut } from "./lib/auth";

import { filterJobs } from "./utils/helpers";

import JobForm from "./components/JobForm";
import KanbanBoard from "./components/KanbanBoard";
import LoginForm from "./components/LoginForm";

import { Search } from "lucide-react";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [modal, setModal] = useState<ModalState>({ mode: "closed" });

  const [searchQuery, setSearchQuery] = useState("");
  const filteredJobs = filterJobs(jobs, searchQuery);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    getJobs().then(setJobs).catch(console.error);
  }, [session]);

  function openAddModal() {
    setModal({ mode: "add" });
  }

  function openEditModal(job: Job) {
    setModal({ mode: "edit", job });
  }

  function closeModal() {
    setModal({ mode: "closed" });
  }

  async function handleAddJob(job: NewJob) {
    const created = await addJob(job);
    setJobs((prev) => [created, ...prev]);
  }

  async function handleMoveJob(jobId: string, newStatus: JobStatus) {
    const previousJobs = jobs;

    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j))
    );

    try {
      await updateJob(jobId, { status: newStatus });
    } catch (err) {
      setJobs(previousJobs);
      console.error(err);
    }
  }

  async function handleDeleteJob(jobId: string) {
    const isConfirmed = window.confirm("Delete this job application?");
    if (!isConfirmed) return;

    const previousJobs = jobs;
    setJobs((jobs) => jobs.filter((job) => job.id !== jobId));

    try {
      await deleteJob(jobId);
    } catch (err) {
      setJobs(previousJobs);
      console.error(err);
    }
  }

  async function handleEditJob(
    jobId: string,
    updates: Partial<Omit<Job, "id" | "created_at">>
  ) {
    await updateJob(jobId, updates);
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, ...updates } : j))
    );
  }

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading) return null;
  if (!session) return <LoginForm />;

  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 md:px-8">
      <header className="flex flex-col gap-3 py-4 md:grid md:grid-cols-3 md:items-center">
        <div className="flex items-center justify-between md:justify-start">
          <h1 className="font-display text-xl font-semibold">JobTrackr</h1>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openAddModal}
              className="bg-signal hover:bg-signal/90 focus-visible:ring-signal cursor-pointer rounded-xl px-3 py-1.5 font-sans text-sm text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              + New Job
            </button>
            <button
              onClick={handleSignOut}
              className="text-ink/60 hover:text-ink cursor-pointer rounded-md px-2 py-1.5 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="text-ink/40 pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 translate-y-[-50%]" />
            <input
              className="focus:ring-signal text-ink placeholder:text-ink/40 w-full rounded-xl bg-white py-2 pr-4 pl-10 text-sm transition-all outline-none focus:ring-2"
              type="text"
              placeholder="Search company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden items-center justify-end gap-2 md:flex">
          <button
            onClick={openAddModal}
            className="bg-signal hover:bg-signal/90 focus-visible:ring-signal cursor-pointer rounded-xl px-4 py-2 font-sans text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            + New Job
          </button>
          <button
            onClick={handleSignOut}
            className="text-ink/60 hover:text-ink cursor-pointer rounded-md px-3 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </header>

      <main>
        <KanbanBoard
          jobs={filteredJobs}
          onMoveJob={handleMoveJob}
          onDeleteJob={handleDeleteJob}
          onCardClick={openEditModal}
        />
        {modal.mode !== "closed" && (
          <JobForm
            key={modal.mode === "edit" ? modal.job.id : "new"}
            onClose={closeModal}
            onAddJob={handleAddJob}
            onEditJob={handleEditJob}
            initialData={modal.mode === "edit" ? modal.job : undefined}
          />
        )}
      </main>
    </div>
  );
}

export default App;
