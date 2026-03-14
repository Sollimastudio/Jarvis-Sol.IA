import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json, longtext, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Sol.IA: Conversas e Histórico
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }),
  summary: longtext("summary"),
  messageCount: int("messageCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Sol.IA: Mensagens de Chat
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: longtext("content").notNull(),
  metadata: json("metadata"),
  agentType: varchar("agentType", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Sol.IA: Insights e Ideias
export const insights = mysqlTable("insights", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: longtext("content").notNull(),
  category: varchar("category", { length: 64 }),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium"),
  tags: json("tags"),
  relatedMessages: json("relatedMessages"),
  actionable: boolean("actionable").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = typeof insights.$inferInsert;

// Sol.IA: Documentos Processados
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["pdf", "google_drive", "upload"]).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 512 }),
  extractedText: longtext("extractedText"),
  summary: longtext("summary"),
  keyTopics: json("keyTopics"),
  metadata: json("metadata"),
  processedAt: timestamp("processedAt").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Sol.IA: Conhecimento Pessoal (Wikipedia da Usuária)
export const userKnowledge = mysqlTable("user_knowledge", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  category: varchar("category", { length: 64 }).notNull(),
  key: varchar("key", { length: 255 }).notNull(),
  value: longtext("value").notNull(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("1.00"),
  sources: json("sources"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserKnowledge = typeof userKnowledge.$inferSelect;
export type InsertUserKnowledge = typeof userKnowledge.$inferInsert;

// Sol.IA: Padrões de Aprendizado
export const learningPatterns = mysqlTable("learning_patterns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  patternType: varchar("patternType", { length: 64 }).notNull(),
  description: longtext("description"),
  frequency: int("frequency").default(1),
  lastDetected: timestamp("lastDetected").defaultNow(),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.50"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LearningPattern = typeof learningPatterns.$inferSelect;
export type InsertLearningPattern = typeof learningPatterns.$inferInsert;

// Sol.IA: Agentes e Suas Análises
export const agentAnalyses = mysqlTable("agent_analyses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentType: varchar("agentType", { length: 64 }).notNull(),
  analysisType: varchar("analysisType", { length: 64 }).notNull(),
  content: longtext("content"),
  findings: json("findings"),
  recommendations: json("recommendations"),
  confidence: decimal("confidence", { precision: 3, scale: 2 }).default("0.50"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentAnalysis = typeof agentAnalyses.$inferSelect;
export type InsertAgentAnalysis = typeof agentAnalyses.$inferInsert;