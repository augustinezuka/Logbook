"use client";

import { useState, useTransition } from "react";
import Dialog from "./Dialog";
import { addRevenueAction } from "@/lib/actions";

export default function AddRevenueDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addRevenueAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="stamp-btn w-full sm:w-auto rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-income)] px-4 py-2.5 sm:py-2 text-sm font-semibold text-white transition-all duration-200 hover:shadow-md active:shadow-sm disabled:opacity-60"
      >
        + Log revenue
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Log revenue">
        <form action={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              name="sourceType"
              defaultValue="game"
              className="flex-1 rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-income)] focus:outline-none focus:ring-1 focus:ring-[var(--color-income)]"
            >
              <option value="game">Game</option>
              <option value="other">Other source</option>
            </select>
            <input
              name="source"
              placeholder="Source name"
              required
              className="flex-1 rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-income)] focus:outline-none focus:ring-1 focus:ring-[var(--color-income)]"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              required
              className="flex-1 rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm focus:border-[var(--color-income)] focus:outline-none focus:ring-1 focus:ring-[var(--color-income)]"
            />
            <input
              name="entryDate"
              type="date"
              defaultValue={today}
              required
              className="flex-1 rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-income)] focus:outline-none focus:ring-1 focus:ring-[var(--color-income)]"
            />
          </div>
          <input
            name="notes"
            placeholder="Notes (optional)"
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm focus:border-[var(--color-income)] focus:outline-none focus:ring-1 focus:ring-[var(--color-income)]"
          />
          {error && <p className="text-sm text-[var(--color-expense)] font-semibold">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="stamp-btn mt-2 w-full rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-income)] px-4 py-2.5 font-semibold text-white transition-all duration-200 hover:shadow-md active:shadow-sm disabled:opacity-60"
          >
            {pending ? "Saving…" : "Add revenue"}
          </button>
        </form>
      </Dialog>
    </>
  );
}
