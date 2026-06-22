import { pgTable, text, timestamp, uuid, integer, numeric, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  role: text("role").default("renter").notNull(), // renter | admin
  hostStatus: text("host_status"), // null | pending | approved | rejected
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export const rentalRequests = pgTable("rental_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventType: text("event_type").notNull(), // athletic, conference, film_production, event, rehearsal, meeting, other
  spaceType: text("space_type").notNull(), // studio, warehouse, event_hall, outdoor, gym, classroom, office, other
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  budget: numeric("budget").notNull(),
  headcount: integer("headcount").notNull(),
  amenities: text("amenities").notNull(), // comma-separated
  locationPreference: text("location_preference").notNull(),
  notes: text("notes"),
  status: text("status").default("open").notNull(), // open, closed, fulfilled
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const proposals = pgTable("proposals", {
  id: uuid("id").defaultRandom().primaryKey(),
  requestId: uuid("request_id")
    .references(() => rentalRequests.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  sublerLink: text("subler_link").notNull(),
  pitch: text("pitch").notNull(),
  status: text("status").default("pending").notNull(), // pending, accepted, rejected, etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ many }) => ({
  rentalRequests: many(rentalRequests),
  proposals: many(proposals),
  accounts: many(accounts),
  sessions: many(sessions),
}));

export const rentalRequestsRelations = relations(rentalRequests, ({ one, many }) => ({
  user: one(users, {
    fields: [rentalRequests.userId],
    references: [users.id],
  }),
  proposals: many(proposals),
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
  request: one(rentalRequests, {
    fields: [proposals.requestId],
    references: [rentalRequests.id],
  }),
  user: one(users, {
    fields: [proposals.userId],
    references: [users.id],
  }),
}));
