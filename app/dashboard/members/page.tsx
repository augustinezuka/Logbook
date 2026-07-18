import { getOrgMembers, removeMemberAction } from "@/lib/actions";
import { getSessionUser } from "@/lib/auth";
import AddMemberDialog from "@/components/AddMemberDialog";

export default async function MembersPage() {
  const [members, user] = await Promise.all([getOrgMembers(), getSessionUser()]);
  const isOwner = user?.role === "owner";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Members</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Everyone here can see and log entries in this company's ledger.
          </p>
        </div>
        {isOwner && <AddMemberDialog />}
      </div>

      <ul className="flex flex-col gap-2">
        {members.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-sm border border-[var(--color-line)] bg-[var(--color-paper-raised)] px-4 py-3 text-sm"
          >
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-[var(--color-muted)]">{m.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-wide text-[var(--color-muted)]">
                {m.role}
              </span>
              {isOwner && m.id !== user?.id && (
                <form
                  action={async () => {
                    "use server";
                    await removeMemberAction(m.id);
                  }}
                >
                  <button type="submit" className="text-[var(--color-expense)] underline">
                    Remove
                  </button>
                </form>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
