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
        className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-income)] px-4 py-2 text-sm font-semibold text-white"
      >
        + Log revenue
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Log revenue">
        <form action={handleSubmit} className="flex flex-col gap-3">
          <div className="flex gap-3">
            <select
              name="sourceType"
              defaultValue="game"
              className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
            >
              <option value="game">Game</option>
              <option value="other">Other source</option>
            </select>
            <input
              name="source"
              placeholder="Source name"
              required
              className="flex-1 rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-3">
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Amount"
              required
              className="flex-1 rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 font-mono text-sm"
            />
            <input
              name="entryDate"
              type="date"
              defaultValue={today}
              required
              className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
            />
          </div>
          <input
            name="notes"
            placeholder="Notes (optional)"
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-[var(--color-expense)]">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="stamp-btn mt-1 rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-income)] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Add revenue"}
          </button>
        </form>
      </Dialog>
    </>
  );
}
