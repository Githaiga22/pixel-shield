import { sqliteTable, text, integer, boolean, real, sql } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Images table to store uploaded images
export const images = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileHash: text("file_hash").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadDate: integer("upload_date", { mode: "timestamp" }).notNull(),
});

// Image verification results
export const verifications = sqliteTable("verifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageId: integer("image_id").references(() => images.id).notNull(),
  status: text("status").notNull(), // pending, completed, failed
  isAuthentic: integer("is_authentic"), // 1 = authentic, 0 = AI-generated
  aiConfidence: integer("ai_confidence"), // Confidence score (0-100)
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  blockchainTxHash: text("blockchain_tx_hash"),
  blockchainBlockNumber: integer("blockchain_block_number"),
});

// Edit history for images
export const editHistory = sqliteTable("edit_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  imageId: integer("image_id").references(() => images.id).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Specific changes made to an image
export const editChanges = sqliteTable("edit_changes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  editHistoryId: integer("edit_history_id").references(() => editHistory.id).notNull(),
  type: text("type").notNull(), // e.g., brightness, contrast, saturation
  level: integer("level").notNull(), // percentage value
  changeDate: integer("change_date", { mode: "timestamp" }).notNull(),
});

// Define relations
export const imagesRelations = relations(images, ({ many }) => ({
  verifications: many(verifications),
  editHistory: many(editHistory),
}));

export const verificationsRelations = relations(verifications, ({ one }) => ({
  image: one(images, {
    fields: [verifications.imageId],
    references: [images.id],
  }),
}));

export const editHistoryRelations = relations(editHistory, ({ one, many }) => ({
  image: one(images, {
    fields: [editHistory.imageId],
    references: [images.id],
  }),
  changes: many(editChanges),
}));

export const editChangesRelations = relations(editChanges, ({ one }) => ({
  history: one(editHistory, {
    fields: [editChanges.editHistoryId],
    references: [editHistory.id],
  }),
}));

// Schema for inserting new images
export const insertImageSchema = createInsertSchema(images);
export type InsertImage = z.infer<typeof insertImageSchema>;

// Schema for inserting new verifications
export const insertVerificationSchema = createInsertSchema(verifications);
export type InsertVerification = z.infer<typeof insertVerificationSchema>;

// Schema for inserting new edit history
export const insertEditHistorySchema = createInsertSchema(editHistory);
export type InsertEditHistory = z.infer<typeof insertEditHistorySchema>;

// Schema for inserting new edit changes
export const insertEditChangeSchema = createInsertSchema(editChanges);
export type InsertEditChange = z.infer<typeof insertEditChangeSchema>;
