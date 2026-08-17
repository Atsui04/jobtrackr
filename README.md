# JobTrackr

A kanban-style job application tracker for managing your job search — from application to offer.

[![CI](https://github.com/Atsui04/jobtrackr/actions/workflows/ci.yml/badge.svg)](https://github.com/Atsui04/jobtrackr/actions/workflows/ci.yml)

![JobTrackr screenshot](./screenshot.png)

**[Live demo →](https://jobtrackr-jade.vercel.app/)**

Use the demo account to explore the board:

- Email: `demo@jobtrackr.app`
- Password: `demo12345`

## Features

- Kanban board with 5 statuses: Applied → Screening → Interview → Offer → Rejected
- Drag-and-drop between columns to update application status
- Full CRUD: add, edit, and delete job applications
- Email/password authentication with per-user data isolation (Supabase Auth + Row Level Security)
- Search and filter jobs by company or position
- Form validation with react-hook-form and Zod
- Optimistic UI updates with rollback on network errors
- Accessibility: full keyboard support, ARIA labels, native `<dialog>` focus trapping
- CI pipeline: lint and tests run on every push/PR

## Tech stack

| Category     | Technology                                    |
| ------------ | --------------------------------------------- |
| Frontend     | React, TypeScript, Vite                       |
| Styling      | Tailwind CSS v4                               |
| Forms        | React Hook Form, Zod                          |
| Backend / DB | Supabase (Postgres, Auth, auto-generated API) |
| Drag & Drop  | @dnd-kit/react                                |
| Testing      | Vitest, React Testing Library                 |
| CI           | GitHub Actions                                |

## Running locally

```bash
git clone https://github.com/Atsui04/jobtrackr.git
cd jobtrackr
npm install
```

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

```bash
npm run dev
```

Then create your own user via **Supabase Dashboard → Authentication → Users → Add user** (public sign-up is disabled by design — see [Database](#database) below).

## Testing

```bash
npm run test
```

## Project structure

```
src/
  components/
    JobForm.tsx        # add/edit job modal
    LoginForm.tsx        # sign-in form
    JobCard.tsx            # a single job card on the board
    KanbanColumn.tsx         # a single status column
    KanbanBoard.tsx            # dnd context + grouping by status
  lib/
    supabase.ts          # Supabase client setup
    auth.ts                # sign in / sign out
    jobs.ts                  # CRUD functions (getJobs, addJob, updateJob, deleteJob)
  types/
    job.ts                 # Job, NewJob, JobStatus types
    modalState.ts             # ModalState type
  utils/
    constants.ts            # status list and color tokens
    helpers.ts                 # search/filter logic
```

## Database

A `jobs` table in Supabase with Row Level Security enabled, scoped per user via `auth.uid() = user_id`. Public sign-up is intentionally disabled — new accounts are created manually via the Supabase dashboard. Schema:

| Column         | Type                |
| -------------- | ------------------- |
| `id`           | `uuid`, primary key |
| `company`      | `text`              |
| `position`     | `text`              |
| `status`       | `text`              |
| `applied_date` | `date`              |
| `link`         | `text`, nullable    |
| `notes`        | `text`, nullable    |
| `created_at`   | `timestamptz`       |
| `user_id`      | `uuid`, foreign key |
