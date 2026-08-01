import { useEffect, useState } from "react";
import JobForm from "./components/JobForm";
import type { Job, JobStatus, NewJob } from "./types/job";
import { addJob, deleteJob, getJobs, updateJob } from "./lib/jobs";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    getJobs().then(setJobs).catch(console.error);
  }, []);

  function handleClose() {
    setIsModalOpen((prev) => !prev);
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
      await updateJob(jobId, newStatus);
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

  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col px-4 md:px-8">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="font-display text-xl font-semibold">JobTrackr</h1>
        <button
          onClick={handleClose}
          className="bg-signal hover:bg-signal/90 focus-visible:ring-signal cursor-pointer rounded-xl px-4 py-2 font-sans text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          + New Job
        </button>
      </header>

      <main>
        <KanbanBoard
          jobs={jobs}
          onMoveJob={handleMoveJob}
          onDeleteJob={handleDeleteJob}
        />
        {isModalOpen && (
          <JobForm onClose={handleClose} onAddJob={handleAddJob} />
        )}
      </main>
    </div>
  );
}

export default App;
