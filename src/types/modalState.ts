import type { Job } from "./job";

export type ModalState =
  { mode: "closed" } | { mode: "add" } | { mode: "edit"; job: Job };
