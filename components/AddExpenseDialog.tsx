"use client";

import { useState, useTransition } from "react";
import Dialog from "./Dialog";
import { addExpenseAction } from "@/lib/actions";

export default function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addExpenseAction(formData);
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
        className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-expense)] px-4 py-2 text-sm font-semibold text-white"
      >
        + Log expense
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Log expense">
        <form action={handleSubmit} className="flex flex-col gap-3">
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
            name="category"
            placeholder="Category (optional)"
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <input
            name="reason"
            placeholder="Reason — required"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          {error && <p className="text-sm text-[var(--color-expense)]">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="stamp-btn mt-1 rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-expense)] px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Add expense"}
          </button>
        </form>
      </Dialog>
    </>
  );
}
