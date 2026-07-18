import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["owner", "member"]);

export const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("member"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Revenue: money coming in — games or other sources
export const revenueEntries = pgTable("revenue_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  source: varchar("source", { length: 255 }).notNull(), // e.g. game name, or "other"
  sourceType: varchar("source_type", { length: 50 }).notNull().default("game"), // "game" | "other"
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  notes: text("notes"),
  entryDate: date("entry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Expenses: money going out — always needs a reason
export const expenseEntries = pgTable("expense_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  category: varchar("category", { length: 100 }),
  entryDate: date("entry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(users),
  revenueEntries: many(revenueEntries),
  expenseEntries: many(expenseEntries),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
  revenueEntries: many(revenueEntries),
  expenseEntries: many(expenseEntries),
}));

export const revenueEntriesRelations = relations(revenueEntries, ({ one }) => ({
  organization: one(organizations, {
    fields: [revenueEntries.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [revenueEntries.createdBy],
    references: [users.id],
  }),
}));

export const expenseEntriesRelations = relations(expenseEntries, ({ one }) => ({
  organization: one(organizations, {
    fields: [expenseEntries.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [expenseEntries.createdBy],
    references: [users.id],
  }),
}));
