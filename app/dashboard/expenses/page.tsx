import { deleteExpenseAction, getExpenseEntries } from "@/lib/actions";
import AddExpenseDialog from "@/components/AddExpenseDialog";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default async function ExpensesPage() {
  const entries = await getExpenseEntries();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Expenses</h1>
        <AddExpenseDialog />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-left text-[var(--color-muted)]">
            <th className="py-2 font-medium">Date</th>
            <th className="py-2 font-medium">Reason</th>
            <th className="py-2 font-medium">Category</th>
            <th className="py-2 text-right font-medium">Amount</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-[var(--color-line)]">
              <td className="py-2 font-mono text-xs">{e.entryDate}</td>
              <td className="py-2">{e.reason}</td>
              <td className="py-2">{e.category ?? "—"}</td>
              <td className="py-2 text-right font-mono font-medium text-[var(--color-expense)]">
                {formatMoney(Number(e.amount))}
              </td>
              <td className="py-2 text-right">
                <form
                  action={async () => {
                    "use server";
                    await deleteExpenseAction(e.id);
                  }}
                >
                  <button type="submit" className="text-[var(--color-expense)] underline">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-[var(--color-muted)]">
                No expenses logged yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
