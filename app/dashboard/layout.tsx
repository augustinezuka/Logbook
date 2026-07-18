import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-paper-raised)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <span className="font-display text-lg font-semibold">Ledger</span>
            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link href="/dashboard">Overview</Link>
              <Link href="/dashboard/revenue">Revenue</Link>
              <Link href="/dashboard/expenses">Expenses</Link>
              <Link href="/dashboard/members">Members</Link>
            </nav>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="flex items-center gap-3 text-sm text-[var(--color-muted)]"
          >
            <span>{session?.user?.name}</span>
            <button type="submit" className="underline">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
    </div>
  );
}
