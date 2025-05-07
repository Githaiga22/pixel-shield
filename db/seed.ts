import { db } from "./index";
import * as schema from "@shared/schema";
import crypto from "crypto";

function generateRandomHash() {
  return crypto.randomBytes(32).toString('hex');
}

async function seed() {
  try {
    // Seed sample images
    console.log("Seeding sample images...");
    
    const [image1] = await db.insert(schema.images).values({
      fileName: "photo_1234.jpg",
      mimeType: "image/jpeg",
      fileHash: generateRandomHash(),
      fileSize: 1024 * 1024 * 2, // 2MB
      uploadDate: new Date("2025-02-14T10:32:00Z")
    }).returning();
    
    // Seed sample verifications
    console.log("Seeding sample verifications...");
    
    const [verification1] = await db.insert(schema.verifications).values({
      imageId: image1.id,
      status: "completed",
      isAuthentic: true,
      aiConfidence: 98.5,
      createdAt: new Date("2025-02-14T10:33:00Z"),
      completedAt: new Date("2025-02-14T10:34:00Z"),
      blockchainTxHash: "0x" + generateRandomHash(),
      blockchainBlockNumber: 16728391
    }).returning();
    
    // Seed sample edit history
    console.log("Seeding sample edit history...");
    
    const [editHistory1] = await db.insert(schema.editHistory).values({
      imageId: image1.id,
      createdAt: new Date("2025-02-14T11:00:00Z")
    }).returning();
    
    // Seed sample edit changes
    console.log("Seeding sample edit changes...");
    
    await db.insert(schema.editChanges).values([
      {
        editHistoryId: editHistory1.id,
        type: "brightness",
        level: 50,
        changeDate: new Date("2023-07-10T14:59:00Z")
      },
      {
        editHistoryId: editHistory1.id,
        type: "brightness",
        level: 20,
        changeDate: new Date("2023-07-15T15:00:00Z")
      },
      {
        editHistoryId: editHistory1.id,
        type: "contrast",
        level: 50,
        changeDate: new Date("2023-07-10T14:59:00Z")
      },
      {
        editHistoryId: editHistory1.id,
        type: "contrast",
        level: 20,
        changeDate: new Date("2023-07-15T15:00:00Z")
      }
    ]);
    
    console.log("Seed completed successfully!");
  }
  catch (error) {
    console.error("Seed error:", error);
  }
}

seed();
