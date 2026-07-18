"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq, and, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { organizations, users, revenueEntries, expenseEntries } from "@/lib/db/schema";
import { signIn, getSessionUser } from "@/lib/auth";

// ---------- Sign up: creates a new organization + its first (owner) user ----------

const signupSchema = z.object({
  companyName: z.string().min(2, "Company name is too short"),
  name: z.string().min(1, "Your name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 7)
  );
}

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    companyName: formData.get("companyName"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { companyName, name, email, password } = parsed.data;

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [org] = await db
    .insert(organizations)
    .values({ name: companyName, slug: slugify(companyName) })
    .returning();

  await db.insert(users).values({
    organizationId: org.id,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "owner",
  });

  await signIn("credentials", {
    email: email.toLowerCase(),
    password,
    redirectTo: "/dashboard",
  });
}

// ---------- Helper: current session's org-scoped user ----------

async function requireSession() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return { user };
}

// ---------- Revenue ----------

const revenueSchema = z.object({
  source: z.string().min(1, "Source is required"),
  sourceType: z.enum(["game", "other"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  entryDate: z.string().min(1),
  notes: z.string().optional(),
});

export async function addRevenueAction(formData: FormData) {
  const session = await requireSession();
  const parsed = revenueSchema.safeParse({
    source: formData.get("source"),
    sourceType: formData.get("sourceType"),
    amount: formData.get("amount"),
    entryDate: formData.get("entryDate"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.insert(revenueEntries).values({
    organizationId: session.user.organizationId,
    createdBy: session.user.id,
    ...parsed.data,
    amount: parsed.data.amount.toString(),
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/revenue");
}

export async function deleteRevenueAction(id: string) {
  const session = await requireSession();
  await db
    .delete(revenueEntries)
    .where(
      and(
        eq(revenueEntries.id, id),
        eq(revenueEntries.organizationId, session.user.organizationId)
      )
    );
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/revenue");
}

export async function getRevenueEntries() {
  const session = await requireSession();
  return db.query.revenueEntries.findMany({
    where: eq(revenueEntries.organizationId, session.user.organizationId),
    orderBy: desc(revenueEntries.entryDate),
    with: { creator: { columns: { name: true } } },
  });
}

// ---------- Expenses ----------

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  reason: z.string().min(1, "A reason is required"),
  category: z.string().optional(),
  entryDate: z.string().min(1),
});

export async function addExpenseAction(formData: FormData) {
  const session = await requireSession();
  const parsed = expenseSchema.safeParse({
    amount: formData.get("amount"),
    reason: formData.get("reason"),
    category: formData.get("category") || undefined,
    entryDate: formData.get("entryDate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.insert(expenseEntries).values({
    organizationId: session.user.organizationId,
    createdBy: session.user.id,
    ...parsed.data,
    amount: parsed.data.amount.toString(),
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
}

export async function deleteExpenseAction(id: string) {
  const session = await requireSession();
  await db
    .delete(expenseEntries)
    .where(
      and(
        eq(expenseEntries.id, id),
        eq(expenseEntries.organizationId, session.user.organizationId)
      )
    );
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
}

export async function getExpenseEntries() {
  const session = await requireSession();
  return db.query.expenseEntries.findMany({
    where: eq(expenseEntries.organizationId, session.user.organizationId),
    orderBy: desc(expenseEntries.entryDate),
    with: { creator: { columns: { name: true } } },
  });
}

// ---------- Members ----------

const memberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function addMemberAction(formData: FormData) {
  const session = await requireSession();

  if (session.user.role !== "owner") {
    return { error: "Only the owner can add members." };
  }

  const parsed = memberSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, email, password } = parsed.data;

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .limit(1);

  if (existing) {
    return { error: "That email is already in use." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    organizationId: session.user.organizationId,
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "member",
  });

  revalidatePath("/dashboard/members");
}

export async function getOrgMembers() {
  const session = await requireSession();
  return db.query.users.findMany({
    where: eq(users.organizationId, session.user.organizationId),
    columns: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: (u, { asc }) => asc(u.createdAt),
  });
}

export async function removeMemberAction(memberId: string) {
  const session = await requireSession();
  if (session.user.role !== "owner") {
    return { error: "Only the owner can remove members." };
  }
  if (memberId === session.user.id) {
    return { error: "You can't remove yourself." };
  }
  await db
    .delete(users)
    .where(and(eq(users.id, memberId), eq(users.organizationId, session.user.organizationId)));
  revalidatePath("/dashboard/members");
}

// ---------- Monthly comparison ----------

export async function getMonthlyComparison() {
  const [revenue, expenses] = await Promise.all([getRevenueEntries(), getExpenseEntries()]);

  const months = new Map<string, { month: string; revenue: number; expenses: number }>();

  function bucketFor(dateStr: string) {
    const key = dateStr.slice(0, 7); // YYYY-MM
    if (!months.has(key)) {
      const label = new Date(`${key}-01T00:00:00`).toLocaleDateString(undefined, {
        month: "short",
        year: "2-digit",
      });
      months.set(key, { month: label, revenue: 0, expenses: 0 });
    }
    return months.get(key)!;
  }

  for (const r of revenue) bucketFor(r.entryDate).revenue += Number(r.amount);
  for (const e of expenses) bucketFor(e.entryDate).expenses += Number(e.amount);

  return Array.from(months.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([, v]) => v);
}

// ---------- Dashboard summary ----------

export async function getSummary() {
  const [revenue, expenses] = await Promise.all([getRevenueEntries(), getExpenseEntries()]);

  const totalRevenue = revenue.reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return {
    totalRevenue,
    totalExpenses,
    net: totalRevenue - totalExpenses,
    recentRevenue: revenue.slice(0, 5),
    recentExpenses: expenses.slice(0, 5),
  };
}
