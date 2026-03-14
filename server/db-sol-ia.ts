import { eq, desc, and, like } from "drizzle-orm";
import {
  conversations,
  messages,
  insights,
  documents,
  userKnowledge,
  learningPatterns,
  agentAnalyses,
  type InsertConversation,
  type InsertMessage,
  type InsertInsight,
  type InsertDocument,
  type InsertUserKnowledge,
  type InsertLearningPattern,
  type InsertAgentAnalysis,
} from "../drizzle/schema";
import { getDb } from "./db";

// ============ CONVERSATIONS ============

export async function createConversation(data: InsertConversation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(conversations).values(data);
  return result;
}

export async function getUserConversations(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(desc(conversations.updatedAt))
    .limit(limit);
}

export async function getConversationById(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);
  
  return result[0];
}

// ============ MESSAGES ============

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(messages).values(data);
  
  // Update conversation message count
  const conv = await getConversationById(data.conversationId);
  if (conv) {
    await db
      .update(conversations)
      .set({ messageCount: (conv.messageCount || 0) + 1 })
      .where(eq(conversations.id, data.conversationId));
  }
  
  return result;
}

export async function getConversationMessages(conversationId: number, limit = 100) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt)
    .limit(limit);
}

// ============ INSIGHTS ============

export async function createInsight(data: InsertInsight) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(insights).values(data);
}

export async function getUserInsights(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(insights)
    .where(eq(insights.userId, userId))
    .orderBy(desc(insights.priority), desc(insights.createdAt))
    .limit(limit);
}

export async function searchInsights(userId: number, query: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(insights)
    .where(
      and(
        eq(insights.userId, userId),
        like(insights.title, `%${query}%`)
      )
    )
    .orderBy(desc(insights.createdAt));
}

// ============ DOCUMENTS ============

export async function createDocument(data: InsertDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(documents).values(data);
}

export async function getUserDocuments(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(documents)
    .where(eq(documents.userId, userId))
    .orderBy(desc(documents.createdAt))
    .limit(limit);
}

// ============ USER KNOWLEDGE ============

export async function createUserKnowledge(data: InsertUserKnowledge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(userKnowledge).values(data);
}

export async function getUserKnowledgeByCategory(userId: number, category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(userKnowledge)
    .where(
      and(
        eq(userKnowledge.userId, userId),
        eq(userKnowledge.category, category)
      )
    );
}

export async function getUserWikipedia(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(userKnowledge)
    .where(eq(userKnowledge.userId, userId))
    .orderBy(userKnowledge.category);
}

// ============ LEARNING PATTERNS ============

export async function createLearningPattern(data: InsertLearningPattern) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(learningPatterns).values(data);
}

export async function getUserLearningPatterns(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db
    .select()
    .from(learningPatterns)
    .where(eq(learningPatterns.userId, userId))
    .orderBy(desc(learningPatterns.frequency));
}

// ============ AGENT ANALYSES ============

export async function createAgentAnalysis(data: InsertAgentAnalysis) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(agentAnalyses).values(data);
}

export async function getUserAgentAnalyses(userId: number, agentType?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (agentType) {
    return await db
      .select()
      .from(agentAnalyses)
      .where(
        and(
          eq(agentAnalyses.userId, userId),
          eq(agentAnalyses.agentType, agentType)
        )
      )
      .orderBy(desc(agentAnalyses.createdAt));
  }
  
  return await db
    .select()
    .from(agentAnalyses)
    .where(eq(agentAnalyses.userId, userId))
    .orderBy(desc(agentAnalyses.createdAt));
}
