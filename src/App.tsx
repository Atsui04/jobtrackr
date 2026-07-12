import { useEffect, useState } from "react";
import JobForm from "./components/JobForm";
import type { Job, NewJob } from "./types/job";
import { addJob, getJobs } from "./lib/jobs";

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

  return (
    <main className="h-dvh">
      <button onClick={handleClose}>+ New Job</button>
      {isModalOpen && <JobForm onClose={handleClose} onAddJob={handleAddJob} />}
    </main>
  );
}

export default App;
