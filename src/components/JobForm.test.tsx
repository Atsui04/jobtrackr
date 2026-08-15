import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import JobForm from "./JobForm";

describe("JobForm Component", () => {
  const mockOnClose = vi.fn();
  const mockOnAddJob = vi.fn().mockResolvedValue(undefined);
  const mockOnEditJob = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call onAddJob and close modal on valid submit data", async () => {
    const user = userEvent.setup();

    render(
      <JobForm
        onAddJob={mockOnAddJob}
        onClose={mockOnClose}
        onEditJob={mockOnEditJob}
      />
    );
    const dialog = screen.getByRole("dialog", { hidden: true });

    const companyInput = screen.getByLabelText(/company/i);
    const positionInput = screen.getByLabelText(/position/i);
    const submitButton = screen.getByRole("button", { name: /^add$/i });

    await user.type(companyInput, "Google");
    await user.type(positionInput, "Frontend Developer");

    await user.click(submitButton);

    expect(mockOnAddJob).toHaveBeenCalledTimes(1);
    expect(mockOnAddJob).toHaveBeenCalledWith(
      expect.objectContaining({
        company: "Google",
        position: "Frontend Developer",
        status: "applied",
        link: null,
        notes: null,
        applied_date: expect.any(String),
      })
    );
    expect(dialog).not.toHaveAttribute("open");
  });

  it("should not call onAddJob with invalid submit data", async () => {
    const user = userEvent.setup();

    render(
      <JobForm
        onAddJob={mockOnAddJob}
        onClose={mockOnClose}
        onEditJob={mockOnEditJob}
      />
    );

    const submitButton = screen.getByRole("button", { name: /^add$/i });

    await user.click(submitButton);

    expect(await screen.findByText(/company is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/position is required/i)
    ).toBeInTheDocument();
    expect(mockOnAddJob).not.toHaveBeenCalled();
  });

  it("should show an error if link is invalid", async () => {
    const user = userEvent.setup();

    render(
      <JobForm
        onAddJob={mockOnAddJob}
        onClose={mockOnClose}
        onEditJob={mockOnEditJob}
      />
    );

    await user.type(screen.getByLabelText(/company/i), "Google");
    await user.type(screen.getByLabelText(/position/i), "Frontend Developer");
    await user.type(screen.getByLabelText(/link/i), "wrong");

    await user.click(screen.getByRole("button", { name: /^add$/i }));

    expect(await screen.findByText(/must be a valid url/i)).toBeInTheDocument();
    expect(mockOnAddJob).not.toHaveBeenCalled();
  });
});
