import { useState, type SubmitEvent } from "react";
import { signIn } from "../lib/auth";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginScheme = z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .pipe(z.email("Invalid email address")),
    password: z.string().min(8, "Password is required"),
  });

  type LoginFormValues = z.infer<typeof loginScheme>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginScheme),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setError(null);
      await signIn(data.email, data.password);
    } catch {
      setError("Invalid email or password");
    }
  }

  async function handleFormSubmit(e: SubmitEvent<HTMLFormElement>) {
    handleSubmit(onSubmit)(e);
  }

  return (
    <div className="bg-paper flex min-h-dvh items-center justify-center">
      <form
        className="text-ink flex w-full max-w-sm flex-col gap-8 rounded-xl border-none bg-white p-10 font-sans"
        onSubmit={handleFormSubmit}
      >
        <h2 className="font-display text-center text-xl font-semibold">
          JobTrackr
        </h2>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-start justify-between gap-2 font-light">
            <label htmlFor="email" className="text-xs">
              Email
            </label>
            <input
              className="bg-paper focus:ring-signal w-full rounded-lg px-3 py-2 outline-none focus:ring-2"
              type="text"
              id="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            <span className="text-wine block min-h-4 text-xs font-normal">
              {errors.email?.message}
            </span>
          </div>
          <div className="flex flex-col items-start justify-between gap-1 font-light">
            <label className="text-xs" htmlFor="password">
              Password
            </label>

            <div className="relative w-full">
              <input
                className="bg-paper focus:ring-signal w-full rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="********"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-ink/40 absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span className="text-wine block min-h-4 text-xs font-normal">
              {errors.password?.message}
            </span>
          </div>
        </div>
        {error && (
          <p role="alert" className="text-wine text-xs">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-signal hover:bg-signal/90 focus-visible:ring-signal cursor-pointer rounded-lg px-4 py-2 font-semibold text-white transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
