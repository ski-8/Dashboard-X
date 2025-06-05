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
