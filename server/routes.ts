import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { insertCommentSchema, insertActivitySchema, insertActionItemSchema } from "@shared/schema";

// File upload configuration
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Development mode: provide dummy user data
  app.get('/api/auth/demo-user', async (req, res) => {
    res.json({
      id: "demo-user-123",
      username: "demo_user",
      displayName: "Demo User",
      role: "admin",
      clientId: "demo-client-456"
    });
  });

  // Dummy analytics data route
  app.get('/api/demo-dashboard', async (req, res) => {
    const dummyData = {
      client: {
        id: "demo-client-456",
        name: "Acme Corporation",
        subdomain: "acme",
        logo: null,
        primaryColor: "#2563eb",
        secondaryColor: "#f1f5f9"
      },
      metrics: [
        // Google Analytics metrics
        { id: 1, clientId: "demo-client-456", source: "google_analytics", name: "Sessions", value: 12453, unit: "count", date: new Date("2024-01-15") },
        { id: 2, clientId: "demo-client-456", source: "google_analytics", name: "Page Views", value: 24856, unit: "count", date: new Date("2024-01-15") },
        { id: 3, clientId: "demo-client-456", source: "google_analytics", name: "Bounce Rate", value: 32.5, unit: "percentage", date: new Date("2024-01-15") },
        { id: 4, clientId: "demo-client-456", source: "google_analytics", name: "Avg Session Duration", value: 245, unit: "seconds", date: new Date("2024-01-15") },
        
        // LinkedIn metrics
        { id: 5, clientId: "demo-client-456", source: "linkedin", name: "Impressions", value: 15420, unit: "count", date: new Date("2024-01-15") },
        { id: 6, clientId: "demo-client-456", source: "linkedin", name: "Clicks", value: 892, unit: "count", date: new Date("2024-01-15") },
        { id: 7, clientId: "demo-client-456", source: "linkedin", name: "Engagement Rate", value: 5.8, unit: "percentage", date: new Date("2024-01-15") },
        
        // Call tracking metrics
        { id: 8, clientId: "demo-client-456", source: "call_tracking", name: "Total Calls", value: 156, unit: "count", date: new Date("2024-01-15") },
        { id: 9, clientId: "demo-client-456", source: "call_tracking", name: "Qualified Leads", value: 89, unit: "count", date: new Date("2024-01-15") },
        { id: 10, clientId: "demo-client-456", source: "call_tracking", name: "Conversion Rate", value: 57.1, unit: "percentage", date: new Date("2024-01-15") }
      ],
      callAgents: [
        { id: 1, clientId: "demo-client-456", name: "Sarah Johnson", phone: "+1-555-0123", email: "sarah@acme.com", status: "available", totalCalls: 142, successfulCalls: 98 },
        { id: 2, clientId: "demo-client-456", name: "Mike Chen", phone: "+1-555-0124", email: "mike@acme.com", status: "busy", totalCalls: 128, successfulCalls: 85 },
        { id: 3, clientId: "demo-client-456", name: "Emily Rodriguez", phone: "+1-555-0125", email: "emily@acme.com", status: "available", totalCalls: 156, successfulCalls: 112 }
      ],
      files: [
        { id: 1, clientId: "demo-client-456", name: "Q1 Marketing Report.pdf", size: 2450000, mimeType: "application/pdf", uploadedAt: new Date("2024-01-10"), uploadedBy: "Sarah Johnson" },
        { id: 2, clientId: "demo-client-456", name: "Campaign Assets.zip", size: 15600000, mimeType: "application/zip", uploadedAt: new Date("2024-01-08"), uploadedBy: "Mike Chen" },
        { id: 3, clientId: "demo-client-456", name: "Brand Guidelines.pdf", size: 8900000, mimeType: "application/pdf", uploadedAt: new Date("2024-01-05"), uploadedBy: "Emily Rodriguez" }
      ],
      comments: [
        { id: 1, clientId: "demo-client-456", content: "The LinkedIn campaign performance has exceeded expectations this month!", author: "Sarah Johnson", createdAt: new Date("2024-01-14T10:30:00") },
        { id: 2, clientId: "demo-client-456", content: "Need to review the call tracking setup for the new product launch.", author: "Mike Chen", createdAt: new Date("2024-01-13T15:45:00") },
        { id: 3, clientId: "demo-client-456", content: "Great work on the Q1 report. The analytics insights are very clear.", author: "Emily Rodriguez", createdAt: new Date("2024-01-12T09:15:00") }
      ],
      actionItems: [
        { id: 1, clientId: "demo-client-456", title: "Set up Google Analytics 4 enhanced tracking", description: "Configure advanced e-commerce tracking for better conversion insights", completed: false, dueDate: new Date("2024-01-20"), assignedTo: "Sarah Johnson" },
        { id: 2, clientId: "demo-client-456", title: "Review LinkedIn ad performance", description: "Analyze Q1 LinkedIn campaign ROI and suggest optimizations", completed: true, dueDate: new Date("2024-01-15"), assignedTo: "Mike Chen" },
        { id: 3, clientId: "demo-client-456", title: "Update call tracking scripts", description: "Deploy new call tracking codes on landing pages", completed: false, dueDate: new Date("2024-01-18"), assignedTo: "Emily Rodriguez" }
      ],
      activities: [
        { id: 1, clientId: "demo-client-456", type: "metric_update", description: "Google Analytics data refreshed", createdAt: new Date("2024-01-15T08:00:00") },
        { id: 2, clientId: "demo-client-456", type: "file_upload", description: "Q1 Marketing Report.pdf uploaded by Sarah Johnson", createdAt: new Date("2024-01-10T14:30:00") },
        { id: 3, clientId: "demo-client-456", type: "comment_added", description: "New comment added by Mike Chen", createdAt: new Date("2024-01-13T15:45:00") },
        { id: 4, clientId: "demo-client-456", type: "action_completed", description: "LinkedIn ad performance review completed", createdAt: new Date("2024-01-15T11:20:00") },
        { id: 5, clientId: "demo-client-456", type: "call_received", description: "New qualified lead call received", createdAt: new Date("2024-01-15T16:45:00") }
      ]
    };
    
    res.json(dummyData);
  });

  // Dashboard data route
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId) {
        return res.status(400).json({ message: "User not associated with a client" });
      }

      // Get client info
      const client = await storage.getClient(user.clientId);
      
      // Get all dashboard data
      const [metrics, callAgents, files, comments, actionItems, activities] = await Promise.all([
        storage.getMetrics(user.clientId),
        storage.getCallAgents(user.clientId),
        storage.getFiles(user.clientId),
        storage.getComments(user.clientId),
        storage.getActionItems(user.clientId),
        storage.getActivities(user.clientId, 10),
      ]);

      res.json({
        client,
        metrics,
        callAgents,
        files,
        comments,
        actionItems,
        activities,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Metrics routes
  app.get('/api/metrics/:source?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId) {
        return res.status(400).json({ message: "User not associated with a client" });
      }

      const metrics = await storage.getMetrics(user.clientId, req.params.source);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // File upload route
  app.post('/api/files/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId) {
        return res.status(400).json({ message: "User not associated with a client" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = await storage.insertFile({
        clientId: user.clientId,
        uploadedBy: userId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
      });

      // Log activity
      await storage.insertActivity({
        clientId: user.clientId,
        type: "file_upload",
        description: `${user.firstName || user.email} uploaded ${req.file.originalname}`,
        metadata: { fileId: file.id },
      });

      res.json(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // File download route
  app.get('/api/files/:id/download', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const fileId = parseInt(req.params.id);
      
      const file = await storage.getFile(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // Check if user has access to this file
      if (file.clientId !== user?.clientId) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.download(file.path, file.originalName);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Comments routes
  app.post('/api/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId) {
        return res.status(400).json({ message: "User not associated with a client" });
      }

      const commentData = insertCommentSchema.parse({
        ...req.body,
        clientId: user.clientId,
        userId: userId,
      });

      const comment = await storage.insertComment(commentData);
      
      // Broadcast to WebSocket clients
      const wss = (req as any).wss;
      if (wss) {
        const message = JSON.stringify({
          type: 'new_comment',
          data: { ...comment, user },
        });
        
        wss.clients.forEach((client: WebSocket) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }

      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Action items routes
  app.post('/api/action-items', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId) {
        return res.status(400).json({ message: "User not associated with a client" });
      }

      const itemData = insertActionItemSchema.parse({
        ...req.body,
        clientId: user.clientId,
        createdBy: userId,
      });

      const item = await storage.upsertActionItem(itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating action item:", error);
      res.status(500).json({ message: "Failed to create action item" });
    }
  });

  app.patch('/api/action-items/:id/toggle', isAuthenticated, async (req: any, res) => {
    try {
      const itemId = parseInt(req.params.id);
      const item = await storage.toggleActionItem(itemId);
      res.json(item);
    } catch (error) {
      console.error("Error toggling action item:", error);
      res.status(500).json({ message: "Failed to toggle action item" });
    }
  });

  // Data sync routes (for external APIs)
  app.post('/api/sync/google-analytics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // TODO: Implement Google Analytics API integration
      res.json({ message: "Google Analytics sync initiated" });
    } catch (error) {
      console.error("Error syncing Google Analytics:", error);
      res.status(500).json({ message: "Failed to sync Google Analytics" });
    }
  });

  app.post('/api/sync/linkedin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // TODO: Implement LinkedIn API integration
      res.json({ message: "LinkedIn sync initiated" });
    } catch (error) {
      console.error("Error syncing LinkedIn:", error);
      res.status(500).json({ message: "Failed to sync LinkedIn" });
    }
  });

  app.post('/api/sync/google-sheets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user?.clientId || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      // TODO: Implement Google Sheets API integration
      res.json({ message: "Google Sheets sync initiated" });
    } catch (error) {
      console.error("Error syncing Google Sheets:", error);
      res.status(500).json({ message: "Failed to sync Google Sheets" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data);
        
        // Handle different message types
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Store WebSocket server reference for use in routes
  (app as any).wss = wss;

  return httpServer;
}
