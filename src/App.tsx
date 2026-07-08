import { useEffect, useState } from "react";
import { getJobs } from "./lib/jobs";
import type { Job } from "./types/job";

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    getJobs().then(setJobs).catch(console.error);
  }, []);

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          {job.company} — {job.position} ({job.status})
        </li>
      ))}
    </ul>
  );
}

export default App;
