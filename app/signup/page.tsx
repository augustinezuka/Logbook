import Link from "next/link";
import { signupAction } from "@/lib/actions";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Start a new ledger</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          This sets up a fresh, private ledger just for your company. Invite
          teammates once you're in.
        </p>
      </div>
      <form action={signupAction} className="ledger-tape flex flex-col gap-4 p-6">
        <div className="flex flex-col gap-1">
          <label htmlFor="companyName" className="text-sm font-medium">
            Company name
          </label>
          <input
            id="companyName"
            name="companyName"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium">
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2"
          />
        </div>
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
            minLength={8}
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-income)] px-4 py-2 font-semibold text-white"
        >
          Create ledger & account
        </button>
      </form>
      <p className="text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="text-[var(--color-income)] underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
