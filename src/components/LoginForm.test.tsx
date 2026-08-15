import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";
import { signIn } from "../lib/auth";

vi.mock("../lib/auth", () => ({
  signIn: vi.fn(),
}));

describe("LoginForm component", () => {
  const mockedSignIn = vi.mocked(signIn);

  beforeEach(() => {
    vi.clearAllMocks();
    render(<LoginForm />);
  });

  it("should render email and password fields", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/password/i, { selector: "input" })
    ).toBeInTheDocument();
  });

  it("should show validation errors when submitted empty", async () => {
    const user = userEvent.setup();

    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it("should show validation error for malformed email", async () => {
    const user = userEvent.setup();

    const sumbitButton = screen.getByRole("button", { name: /sign in/i });

    const emailInput = screen.getByLabelText(/email/i);

    await user.type(emailInput, "email");

    await user.click(sumbitButton);

    expect(
      await screen.findByText(/invalid email address/i)
    ).toBeInTheDocument();
  });

  it("should call signIn with entered credentials on valid submit", async () => {
    const user = userEvent.setup();
    mockedSignIn.mockResolvedValueOnce(undefined);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i, {
      selector: "input",
    });
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "example@email.com");
    await user.type(passwordInput, "12345678");
    await user.click(submitButton);

    expect(mockedSignIn).toHaveBeenCalledWith("example@email.com", "12345678");
  });

  it("should show error message when signIn rejects", async () => {
    const user = userEvent.setup();
    mockedSignIn.mockRejectedValueOnce(new Error("Invalid login credentials"));

    await user.type(
      screen.getByLabelText(/email/i, { selector: "input" }),
      "example@email.com"
    );
    await user.type(
      screen.getByLabelText(/password/i, { selector: "input" }),
      "12345678"
    );
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(
      await screen.findByText(/invalid email or password/i)
    ).toBeInTheDocument();
  });

  it("should toggle password visibility when eye icon is clicked", async () => {
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i, {
      selector: "input",
    });
    const toggleButton = screen.getByRole("button", { name: /show password/i });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: /hide password/i })
    ).toBeInTheDocument();

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: /show password/i })
    ).toBeInTheDocument();
  });
});
