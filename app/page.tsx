import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const sampleTape = [
  { label: "Frostbound Keep — launch week", amount: "+4,210.00", kind: "in" },
  { label: "Steam cut, Q2", amount: "+1,860.00", kind: "in" },
  { label: "Contractor — pixel art", amount: "-650.00", kind: "out" },
  { label: "Server hosting, June", amount: "-38.40", kind: "out" },
  { label: "Merch drop", amount: "+512.00", kind: "in" },
];

export default async function Home() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-6 py-16">
      <div className="flex flex-col gap-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          for small studios & solo builders
        </span>
        <h1 className="font-display text-5xl font-semibold leading-[1.05] sm:text-6xl">
          Every dollar,
          <br />
          logged by hand.
        </h1>
        <p className="max-w-md text-[var(--color-muted)]">
          No dashboards full of charts you don&apos;t need. Just what came in, what
          went out, and why — one ledger per company, shared with your team.
        </p>
      </div>

      <div className="ledger-tape overflow-hidden py-5">
        <ul className="flex flex-col gap-2 px-6 font-mono text-sm">
          {sampleTape.map((row, i) => (
            <li key={i} className="flex items-center justify-between">
              <span className="text-[var(--color-ink)]">{row.label}</span>
              <span
                className={
                  row.kind === "in"
                    ? "text-[var(--color-income)]"
                    : "text-[var(--color-expense)]"
                }
              >
                {row.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/signup"
          className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-gold)] px-6 py-3 font-semibold text-[var(--color-ink)]"
        >
          Start a new ledger
        </Link>
        <Link
          href="/login"
          className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] px-6 py-3 font-semibold text-[var(--color-ink)]"
        >
          Log in
        </Link>
      </div>

      <p className="font-mono text-xs text-[var(--color-muted)]">
        Free. No card required. Invite your co-founder once you&apos;re in.
      </p>
    </main>
  );
}
