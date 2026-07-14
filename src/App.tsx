import { useEffect, useState } from "react";
import JobForm from "./components/JobForm";
import type { Job, JobStatus, NewJob } from "./types/job";
import { addJob, getJobs, updateJob } from "./lib/jobs";
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
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus } : j)),
    );

    try {
      await updateJob(jobId, newStatus);
    } catch {
      setJobs(previousJobs);
    }
  }

  return (
    <div className="max-w-7xl mx-auto min-h-dvh flex flex-col px-4 md:px-8">
      <header className="flex justify-between py-4 px-6 items-center">
        <h1 className="font-display font-semibold text-xl">JobTrackr</h1>
        <button
          onClick={handleClose}
          className="font-sans bg-signal text-white cursor-pointer py-2 px-4 rounded-xl hover:bg-signal/90 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none transition-colors duration-200"
        >
          + New Job
        </button>
      </header>

      <main>
        <KanbanBoard jobs={jobs} onMoveJob={handleMoveJob} />
        {isModalOpen && (
          <JobForm onClose={handleClose} onAddJob={handleAddJob} />
        )}
      </main>
    </div>
  );
}

export default App;
