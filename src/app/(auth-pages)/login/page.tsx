import { LoginForm } from "@/components/login-form";
import { login } from "@/lib/actions";

// <label htmlFor="email">Email:</label>
// <input id="email" name="email" type="email" required />
// <label htmlFor="password">Password:</label>
// <input id="password" name="password" type="password" required />
// <button formAction={login}>Log in</button>
// <button formAction={signup}>Sign up</button>

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Blobs for background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>
      <div className="w-full max-w-sm">
        <LoginForm action={login} />
      </div>
    </div>
  );
}
