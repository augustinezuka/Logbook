"use client";

import { useState, useTransition } from "react";
import Dialog from "./Dialog";
import { addMemberAction } from "@/lib/actions";

export default function AddMemberDialog() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addMemberAction(formData);
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
        className="stamp-btn rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)]"
      >
        + Add member
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Add a member">
        <form action={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            placeholder="Full name"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Temporary password"
            minLength={8}
            required
            className="rounded-sm border border-[var(--color-line)] bg-white px-3 py-2 text-sm"
          />
          <p className="text-xs text-[var(--color-muted)]">
            Share this password with them directly — they can change it later.
          </p>
          {error && <p className="text-sm text-[var(--color-expense)]">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="stamp-btn mt-1 rounded-sm border-2 border-[var(--color-ink)] bg-[var(--color-gold)] px-4 py-2 font-semibold text-[var(--color-ink)] disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add member"}
          </button>
        </form>
      </Dialog>
    </>
  );
}
