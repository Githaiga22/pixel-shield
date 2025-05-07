import { db } from '@db';
import { 
  verifications,
  images,
  editHistory,
  editChanges
} from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// Generate SHA-256 hash from file buffer
const generateFileHash = (buffer) => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

// Upload an image and return imageId
export const uploadImage = async (fileBuffer, fileName, mimeType) => {
  const fileHash = generateFileHash(fileBuffer);
  
  // Store image in database
  const [imageRecord] = await db.insert(images)
    .values({
      fileName,
      mimeType,
      fileHash,
      fileSize: fileBuffer.length,
      uploadDate: new Date()
    })
    .returning();
  
  return imageRecord;
};

// Create verification record
export const createVerification = async (imageId) => {
  const [verificationRecord] = await db.insert(verifications)
    .values({
      imageId,
      status: 'pending',
      createdAt: new Date()
    })
    .returning();
  
  return verificationRecord;
};

// Update verification with results
export const updateVerificationResult = async (verificationId, result) => {
  const [updated] = await db.update(verifications)
    .set({
      status: 'completed',
      isAuthentic: result.isAuthentic,
      aiConfidence: result.confidence || 0,
      completedAt: new Date(),
      blockchainTxHash: result.txHash || null,
      blockchainBlockNumber: result.blockNumber || null
    })
    .where(eq(verifications.id, verificationId))
    .returning();
  
  return updated;
};

// Get verification by ID with image data
export const getVerificationById = async (verificationId) => {
  const result = await db.query.verifications.findFirst({
    where: eq(verifications.id, verificationId),
    with: {
      image: true
    }
  });
  
  return result;
};

// Add edit history to an image
export const addEditHistory = async (imageId, edits) => {
  // First create edit history record
  const [historyRecord] = await db.insert(editHistory)
    .values({
      imageId,
      createdAt: new Date()
    })
    .returning();
  
  // Then add each edit change
  for (const edit of edits) {
    await db.insert(editChanges)
      .values({
        editHistoryId: historyRecord.id,
        type: edit.type,
        level: edit.level,
        changeDate: new Date(edit.date)
      });
  }
  
  return historyRecord;
};

// Get edit history for an image
export const getEditHistoryByImageId = async (imageId) => {
  const image = await db.query.images.findFirst({
    where: eq(images.id, imageId)
  });
  
  if (!image) {
    return null;
  }
  
  const history = await db.query.editHistory.findMany({
    where: eq(editHistory.imageId, imageId),
    with: {
      changes: true
    },
    orderBy: (editHistory, { desc }) => [desc(editHistory.createdAt)]
  });
  
  // Organize changes by type
  const organizedEdits = {};
  
  for (const historyRecord of history) {
    for (const change of historyRecord.changes) {
      if (!organizedEdits[change.type]) {
        organizedEdits[change.type] = {
          type: change.type,
          changes: []
        };
      }
      
      organizedEdits[change.type].changes.push({
        level: change.level,
        date: change.changeDate
      });
    }
  }
  
  return {
    image,
    edits: Object.values(organizedEdits)
  };
};

// Check if an image is authentic or AI-generated (mock ZK verification)
export const verifyImageAuthenticity = async (imageId) => {
  // Simulate ZK verification process
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Random result for demo purposes - this would be a real ZK proof verification in production
  const isAuthentic = Math.random() > 0.5;
  const confidence = Math.floor(Math.random() * 40) + 60; // 60-100% confidence
  
  // Mock blockchain data
  const txHash = '0x' + crypto.randomBytes(32).toString('hex');
  const blockNumber = Math.floor(Math.random() * 1000000) + 15000000;
  
  const result = {
    isAuthentic,
    confidence,
    txHash,
    blockNumber
  };
  
  return result;
};

// Get image by ID
export const getImageById = async (imageId) => {
  const image = await db.query.images.findFirst({
    where: eq(images.id, imageId)
  });
  
  return image;
};

// Get edit history for a verification
export const getEditHistoryByVerificationId = async (verificationId) => {
  const verification = await getVerificationById(verificationId);
  
  if (!verification) {
    return null;
  }
  
  return getEditHistoryByImageId(verification.imageId);
};
