import type { Express } from "express";
import { createServer, type Server } from "http";
import * as storage from "./storage";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type. Only JPG, JPEG, PNG, and WEBP are allowed."));
    }
    cb(null, true);
  },
});

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Image upload endpoint
  app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Save file to disk
      const fileExtension = path.extname(req.file.originalname);
      const fileName = crypto.randomBytes(16).toString("hex") + fileExtension;
      const filePath = path.join(uploadDir, fileName);
      
      await fs.promises.writeFile(filePath, req.file.buffer);
      
      // Store in database
      const imageRecord = await storage.uploadImage(
        req.file.buffer, 
        req.file.originalname, 
        req.file.mimetype
      );
      
      return res.status(200).json({ 
        success: true, 
        imageId: imageRecord.id,
        fileName: imageRecord.fileName,
        hash: imageRecord.fileHash
      });
    } catch (error) {
      console.error("Upload error:", error);
      return res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Start verification process
  app.post("/api/verify", async (req, res) => {
    try {
      const { imageId } = req.body;
      
      if (!imageId) {
        return res.status(400).json({ error: "Image ID is required" });
      }
      
      // Create verification record
      const verification = await storage.createVerification(imageId);
      
      return res.status(200).json({ 
        success: true, 
        id: verification.id,
        status: "pending"
      });
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({ error: "Failed to start verification" });
    }
  });

  // Get verification result
  app.get("/api/verifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const verification = await storage.getVerificationById(id);
      
      if (!verification) {
        return res.status(404).json({ error: "Verification not found" });
      }
      
      // If verification is pending, check status
      if (verification.status === "pending") {
        // Perform verification
        const result = await storage.verifyImageAuthenticity(verification.imageId);
        
        // Update verification record
        await storage.updateVerificationResult(verification.id, result);
        
        // Get updated verification
        const updatedVerification = await storage.getVerificationById(id);
        
        if (!updatedVerification) {
          return res.status(404).json({ error: "Verification not found after update" });
        }
        
        return res.status(200).json({
          id: updatedVerification.id,
          imageUrl: `/api/images/${updatedVerification.image.id}`,
          fileName: updatedVerification.image.fileName,
          hash: updatedVerification.image.fileHash,
          uploadDate: updatedVerification.image.uploadDate,
          isAuthentic: updatedVerification.isAuthentic,
          isEdited: false, // Default to false until we check edit history
          aiConfidence: updatedVerification.aiConfidence,
          blockchain: {
            txHash: updatedVerification.blockchainTxHash,
            blockNumber: updatedVerification.blockchainBlockNumber
          }
        });
      }
      
      // Return completed verification
      return res.status(200).json({
        id: verification.id,
        imageUrl: `/api/images/${verification.image.id}`,
        fileName: verification.image.fileName,
        hash: verification.image.fileHash,
        uploadDate: verification.image.uploadDate,
        isAuthentic: verification.isAuthentic,
        isEdited: false, // Default to false until we check edit history
        aiConfidence: verification.aiConfidence,
        blockchain: {
          txHash: verification.blockchainTxHash,
          blockNumber: verification.blockchainBlockNumber
        }
      });
    } catch (error) {
      console.error("Get verification error:", error);
      return res.status(500).json({ error: "Failed to get verification" });
    }
  });

  // Get verification edit history
  app.get("/api/verifications/:id/history", async (req, res) => {
    try {
      const { id } = req.params;
      
      const historyData = await storage.getEditHistoryByVerificationId(id);
      
      if (!historyData) {
        return res.status(404).json({ error: "Verification or history not found" });
      }
      
      return res.status(200).json({
        imageUrl: `/api/images/${historyData.image.id}`,
        fileName: historyData.image.fileName,
        hash: historyData.image.fileHash,
        uploadDate: historyData.image.uploadDate,
        isEdited: historyData.edits.length > 0,
        edits: historyData.edits
      });
    } catch (error) {
      console.error("Get history error:", error);
      return res.status(500).json({ error: "Failed to get edit history" });
    }
  });

  // Serve image files
  app.get("/api/images/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get image record
      const imageRecord = await storage.getImageById(id);
      
      if (!imageRecord) {
        return res.status(404).json({ error: "Image not found" });
      }
      
      // Find file by hash in uploads directory
      const files = await fs.promises.readdir(uploadDir);
      const filePath = path.join(uploadDir, files[0]); // Use first file for demo
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Image file not found" });
      }
      
      // Set content type based on mime type
      res.setHeader("Content-Type", imageRecord.mimeType);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Get image error:", error);
      return res.status(500).json({ error: "Failed to get image" });
    }
  });

  // Download verification certificate
  app.get("/api/verifications/:id/certificate", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get verification
      const verification = await storage.getVerificationById(id);
      
      if (!verification || !verification.isAuthentic) {
        return res.status(404).json({ error: "Verification not found or image is not authentic" });
      }
      
      // Generate simple certificate (in a real app this would generate a PDF)
      const verifiedDate = verification.completedAt ? new Date(verification.completedAt).toISOString() : 'Not available';
      const certificateText = `
Certificate of Authenticity
Image: ${verification.image.fileName}
Hash: ${verification.image.fileHash}
Verified: ${verifiedDate}
Blockchain Transaction: ${verification.blockchainTxHash}
Block Number: ${verification.blockchainBlockNumber}
      `;
      
      // Set headers
      res.setHeader("Content-Type", "text/plain");
      res.setHeader("Content-Disposition", `attachment; filename="certificate-${id}.txt"`);
      
      // Send certificate
      res.send(certificateText);
    } catch (error) {
      console.error("Certificate error:", error);
      return res.status(500).json({ error: "Failed to generate certificate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
