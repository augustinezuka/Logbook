import Link from "next/link";
import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

async function loginAction(formData: FormData) {
  "use server";
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      throw new Error("Invalid email or password");
    }
    throw err;
  }
}

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Log in</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Welcome back to your ledger.
        </p>
      </div>
      <form action={loginAction} className="ledger-tape flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-gold)] px-4 py-2 font-semibold text-[var(--color-ink)]"
        >
          Log in
        </button>
      </form>
      <p className="text-sm text-[var(--color-muted)]">
        No account yet?{" "}
        <Link href="/signup" className="text-[var(--color-income)] underline">
          Start a new ledger
        </Link>
      </p>
    </main>
  );
}
