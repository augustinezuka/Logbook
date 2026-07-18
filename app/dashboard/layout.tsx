import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-paper-raised)]">
        <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center">
          <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
            <span className="font-display text-lg font-semibold">Ledger</span>
            <nav className="hidden flex-col gap-3 text-sm font-medium sm:flex sm:flex-row sm:gap-5">
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
            className="w-full sm:w-auto"
          >
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
              <span className="hidden text-sm text-[var(--color-muted)] sm:inline">{session?.user?.name}</span>
              <button
                type="submit"
                className="w-full rounded-md bg-[var(--color-expense)] px-4 py-2 text-sm font-semibold text-white transition-all duration-150 hover:bg-[var(--color-expense-dark)] hover:shadow-md active:scale-95 sm:w-auto"
              >
                Sign out
              </button>
            </div>
          </form>
        </div>
        {/* Mobile navigation */}
        <nav className="flex flex-wrap gap-4 border-t border-[var(--color-line)] px-6 py-3 text-sm font-medium sm:hidden">
          <Link href="/dashboard" className="hover:text-[var(--color-muted)]">Overview</Link>
          <Link href="/dashboard/revenue" className="hover:text-[var(--color-muted)]">Revenue</Link>
          <Link href="/dashboard/expenses" className="hover:text-[var(--color-muted)]">Expenses</Link>
          <Link href="/dashboard/members" className="hover:text-[var(--color-muted)]">Members</Link>
        </nav>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
    </div>
  );
}
