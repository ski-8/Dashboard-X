import {
  users,
  clients,
  metrics,
  callAgents,
  files,
  comments,
  actionItems,
  activities,
  type User,
  type UpsertUser,
  type Client,
  type InsertClient,
  type Metric,
  type InsertMetric,
  type CallAgent,
  type InsertCallAgent,
  type File,
  type InsertFile,
  type Comment,
  type InsertComment,
  type ActionItem,
  type InsertActionItem,
  type Activity,
  type InsertActivity,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Client operations
  getClient(id: string): Promise<Client | undefined>;
  getClientBySubdomain(subdomain: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client>;
  
  // Metrics operations
  getMetrics(clientId: string, source?: string): Promise<Metric[]>;
  insertMetric(metric: InsertMetric): Promise<Metric>;
  insertMetrics(metrics: InsertMetric[]): Promise<Metric[]>;
  
  // Call agent operations
  getCallAgents(clientId: string): Promise<CallAgent[]>;
  upsertCallAgent(agent: InsertCallAgent): Promise<CallAgent>;
  
  // File operations
  getFiles(clientId: string): Promise<File[]>;
  insertFile(file: InsertFile): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
  deleteFile(id: number): Promise<void>;
  
  // Comment operations
  getComments(clientId: string): Promise<Comment[]>;
  insertComment(comment: InsertComment): Promise<Comment>;
  
  // Action item operations
  getActionItems(clientId: string): Promise<ActionItem[]>;
  upsertActionItem(item: InsertActionItem): Promise<ActionItem>;
  toggleActionItem(id: number): Promise<ActionItem>;
  
  // Activity operations
  getActivities(clientId: string, limit?: number): Promise<Activity[]>;
  insertActivity(activity: InsertActivity): Promise<Activity>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Client operations
  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async getClientBySubdomain(subdomain: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.subdomain, subdomain));
    return client;
  }

  async createClient(clientData: InsertClient): Promise<Client> {
    const [client] = await db.insert(clients).values(clientData).returning();
    return client;
  }

  async updateClient(id: string, clientData: Partial<InsertClient>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set({ ...clientData, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  // Metrics operations
  async getMetrics(clientId: string, source?: string): Promise<Metric[]> {
    const conditions = source 
      ? and(eq(metrics.clientId, clientId), eq(metrics.source, source))
      : eq(metrics.clientId, clientId);
    
    return await db
      .select()
      .from(metrics)
      .where(conditions)
      .orderBy(desc(metrics.date));
  }

  async insertMetric(metric: InsertMetric): Promise<Metric> {
    const [result] = await db.insert(metrics).values(metric).returning();
    return result;
  }

  async insertMetrics(metricsData: InsertMetric[]): Promise<Metric[]> {
    return await db.insert(metrics).values(metricsData).returning();
  }

  // Call agent operations
  async getCallAgents(clientId: string): Promise<CallAgent[]> {
    return await db
      .select()
      .from(callAgents)
      .where(eq(callAgents.clientId, clientId))
      .orderBy(desc(callAgents.conversionRate));
  }

  async upsertCallAgent(agentData: InsertCallAgent): Promise<CallAgent> {
    const [agent] = await db
      .insert(callAgents)
      .values(agentData)
      .onConflictDoUpdate({
        target: [callAgents.clientId, callAgents.name],
        set: {
          ...agentData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return agent;
  }

  // File operations
  async getFiles(clientId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.clientId, clientId))
      .orderBy(desc(files.createdAt));
  }

  async insertFile(fileData: InsertFile): Promise<File> {
    const [file] = await db.insert(files).values(fileData).returning();
    return file;
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  // Comment operations
  async getComments(clientId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.clientId, clientId))
      .orderBy(desc(comments.createdAt));
  }

  async insertComment(commentData: InsertComment): Promise<Comment> {
    const [comment] = await db.insert(comments).values(commentData).returning();
    return comment;
  }

  // Action item operations
  async getActionItems(clientId: string): Promise<ActionItem[]> {
    return await db
      .select()
      .from(actionItems)
      .where(eq(actionItems.clientId, clientId))
      .orderBy(desc(actionItems.createdAt));
  }

  async upsertActionItem(itemData: InsertActionItem): Promise<ActionItem> {
    const [item] = await db.insert(actionItems).values(itemData).returning();
    return item;
  }

  async toggleActionItem(id: number): Promise<ActionItem> {
    const [currentItem] = await db.select().from(actionItems).where(eq(actionItems.id, id));
    const [updatedItem] = await db
      .update(actionItems)
      .set({ 
        completed: !currentItem.completed,
        updatedAt: new Date()
      })
      .where(eq(actionItems.id, id))
      .returning();
    return updatedItem;
  }

  // Activity operations
  async getActivities(clientId: string, limit: number = 50): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.clientId, clientId))
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async insertActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  }
}

export const storage = new DatabaseStorage();
