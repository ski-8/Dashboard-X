import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("client").notNull(), // admin, client, viewer, editor
  clientId: varchar("client_id"), // For multi-tenant support
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Client organizations table
export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  brandName: varchar("brand_name"),
  logo: varchar("logo"),
  primaryColor: varchar("primary_color").default("#3b82f6"),
  subdomain: varchar("subdomain").unique(),
  googleSheetsId: varchar("google_sheets_id"),
  googleAnalyticsPropertyId: varchar("google_analytics_property_id"),
  linkedinPageId: varchar("linkedin_page_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Metrics data from various sources
export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull(),
  source: varchar("source").notNull(), // google_analytics, linkedin, google_sheets, calls
  metricType: varchar("metric_type").notNull(), // visitors, reach, calls, conversion_rate, etc.
  value: real("value").notNull(),
  label: varchar("label"),
  date: timestamp("date").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Call agent performance data
export const callAgents = pgTable("call_agents", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull(),
  name: varchar("name").notNull(),
  email: varchar("email"),
  avatar: varchar("avatar"),
  totalCalls: integer("total_calls").default(0),
  qualifiedCalls: integer("qualified_calls").default(0),
  conversionRate: real("conversion_rate").default(0),
  rating: real("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Files shared between clients and team
export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull(),
  uploadedBy: varchar("uploaded_by").notNull(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(),
  path: varchar("path").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments and feedback system
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull(),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Action items and tasks
export const actionItems = pgTable("action_items", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull(),
  title: varchar("title").notNull(),
  completed: boolean("completed").default(false),
  createdBy: varchar("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Activity log
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  clientId: varchar("client_id").notNull(),
  type: varchar("type").notNull(), // lead, campaign_update, milestone, etc.
  description: varchar("description").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  client: one(clients, {
    fields: [users.clientId],
    references: [clients.id],
  }),
  comments: many(comments),
  files: many(files, { relationName: "uploadedFiles" }),
  actionItems: many(actionItems, { relationName: "createdActions" }),
}));

export const clientsRelations = relations(clients, ({ many }) => ({
  users: many(users),
  metrics: many(metrics),
  callAgents: many(callAgents),
  files: many(files),
  comments: many(comments),
  actionItems: many(actionItems),
  activities: many(activities),
}));

export const metricsRelations = relations(metrics, ({ one }) => ({
  client: one(clients, {
    fields: [metrics.clientId],
    references: [clients.id],
  }),
}));

export const callAgentsRelations = relations(callAgents, ({ one }) => ({
  client: one(clients, {
    fields: [callAgents.clientId],
    references: [clients.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  client: one(clients, {
    fields: [files.clientId],
    references: [clients.id],
  }),
  uploadedBy: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  client: one(clients, {
    fields: [comments.clientId],
    references: [clients.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
}));

export const actionItemsRelations = relations(actionItems, ({ one }) => ({
  client: one(clients, {
    fields: [actionItems.clientId],
    references: [clients.id],
  }),
  createdBy: one(users, {
    fields: [actionItems.createdBy],
    references: [users.id],
  }),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  client: one(clients, {
    fields: [activities.clientId],
    references: [clients.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertMetricSchema = createInsertSchema(metrics).omit({
  id: true,
  createdAt: true,
});

export const insertCallAgentSchema = createInsertSchema(callAgents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertActionItemSchema = createInsertSchema(actionItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type CallAgent = typeof callAgents.$inferSelect;
export type InsertCallAgent = z.infer<typeof insertCallAgentSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type ActionItem = typeof actionItems.$inferSelect;
export type InsertActionItem = z.infer<typeof insertActionItemSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
