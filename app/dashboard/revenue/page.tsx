import { deleteRevenueAction, getRevenueEntries } from "@/lib/actions";
import AddRevenueDialog from "@/components/AddRevenueDialog";

function formatMoney(n: number) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

export default async function RevenuePage() {
  const entries = await getRevenueEntries();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Revenue</h1>
        <AddRevenueDialog />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--color-line)] text-left text-[var(--color-muted)]">
            <th className="py-2 font-medium">Date</th>
            <th className="py-2 font-medium">Source</th>
            <th className="py-2 font-medium">Type</th>
            <th className="py-2 text-right font-medium">Amount</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id} className="border-b border-[var(--color-line)]">
              <td className="py-2 font-mono text-xs">{e.entryDate}</td>
              <td className="py-2">{e.source}</td>
              <td className="py-2 capitalize">{e.sourceType}</td>
              <td className="py-2 text-right font-mono font-medium text-[var(--color-income)]">
                {formatMoney(Number(e.amount))}
              </td>
              <td className="py-2 text-right">
                <form
                  action={async () => {
                    "use server";
                    await deleteRevenueAction(e.id);
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
                No revenue logged yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
