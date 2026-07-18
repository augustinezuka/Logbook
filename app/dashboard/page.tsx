import { getSummary, getMonthlyComparison } from "@/lib/actions";
import MonthlyChart from "@/components/MonthlyChart";
import AddRevenueDialog from "@/components/AddRevenueDialog";
import AddExpenseDialog from "@/components/AddExpenseDialog";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default async function DashboardPage() {
  const [{ totalRevenue, totalExpenses, net, recentRevenue, recentExpenses }, monthly] =
    await Promise.all([getSummary(), getMonthlyComparison()]);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-semibold">Overview</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
          <AddRevenueDialog />
          <AddExpenseDialog />
        </div>
      </div>

      {/* Stats Grid - Responsive: 1 col on mobile, 2 on tablet, 3 on desktop */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div className="ledger-tape p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Total revenue
          </p>
          <p className="mt-1 font-mono text-xl sm:text-2xl font-semibold text-[var(--color-income)]">
            {formatMoney(totalRevenue)}
          </p>
        </div>
        <div className="ledger-tape p-4">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Total expenses
          </p>
          <p className="mt-1 font-mono text-xl sm:text-2xl font-semibold text-[var(--color-expense)]">
            {formatMoney(totalExpenses)}
          </p>
        </div>
        <div className="ledger-tape p-4 sm:col-span-2 lg:col-span-1">
          <p className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Net
          </p>
          <p className="mt-1 font-mono text-xl sm:text-2xl font-semibold">{formatMoney(net)}</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="ledger-tape p-4 sm:p-5 overflow-x-auto">
        <h2 className="mb-3 font-display text-lg font-semibold">Month by month</h2>
        <div className="min-w-full sm:min-w-0">
          <MonthlyChart data={monthly} />
        </div>
      </div>

      {/* Recent Entries Grid - Responsive: 1 col on mobile, 2 on tablet+ */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-muted)]">
            Recent revenue
          </h2>
          <ul className="flex flex-col gap-2">
            {recentRevenue.map((r) => (
              <li
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-sm border border-[var(--color-line)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm"
              >
                <span className="flex-1 break-words">{r.source}</span>
                <span className="font-mono font-medium text-[var(--color-income)] sm:whitespace-nowrap">
                  {formatMoney(Number(r.amount))}
                </span>
              </li>
            ))}
            {recentRevenue.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No revenue logged yet.</p>
            )}
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-[var(--color-muted)]">
            Recent expenses
          </h2>
          <ul className="flex flex-col gap-2">
            {recentExpenses.map((e) => (
              <li
                key={e.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-sm border border-[var(--color-line)] bg-[var(--color-paper-raised)] px-3 py-2 text-sm"
              >
                <span className="flex-1 break-words">{e.reason}</span>
                <span className="font-mono font-medium text-[var(--color-expense)] sm:whitespace-nowrap">
                  {formatMoney(Number(e.amount))}
                </span>
              </li>
            ))}
            {recentExpenses.length === 0 && (
              <p className="text-sm text-[var(--color-muted)]">No expenses logged yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
