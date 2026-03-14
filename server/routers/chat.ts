import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createConversation,
  getUserConversations,
  getConversationById,
  getConversationMessages,
  createMessage,
} from "../db-sol-ia";
import { processCognitiveInput } from "../cognitive-engine";

export const chatRouter = router({
  /**
   * Criar uma nova conversa
   */
  createConversation: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await createConversation({
        userId: ctx.user.id,
        title: input.title || `Conversa ${new Date().toLocaleDateString("pt-BR")}`,
        messageCount: 0,
      });

      return conversation;
    }),

  /**
   * Obter conversas do usuário
   */
  getConversations: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      return await getUserConversations(ctx.user.id, input.limit);
    }),

  /**
   * Obter uma conversa específica com suas mensagens
   */
  getConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const conversation = await getConversationById(input.conversationId);

      if (!conversation || conversation.userId !== ctx.user.id) {
        throw new Error("Conversa não encontrada");
      }

      const messages = await getConversationMessages(input.conversationId);

      return {
        conversation,
        messages,
      };
    }),

  /**
   * Enviar mensagem e processar através do motor cognitivo
   */
  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.number(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar que a conversa pertence ao usuário
      const conversation = await getConversationById(input.conversationId);
      if (!conversation || conversation.userId !== ctx.user.id) {
        throw new Error("Conversa não encontrada");
      }

      // Armazenar mensagem do usuário
      await createMessage({
        conversationId: input.conversationId,
        userId: ctx.user.id,
        role: "user",
        content: input.message,
      });

      // Obter histórico recente
      const recentMessages = await getConversationMessages(input.conversationId, 20);

      // Processar através do motor cognitivo
      const cognitiveResponse = await processCognitiveInput({
        userId: ctx.user.id,
        conversationId: input.conversationId,
        userMessage: input.message,
        recentMessages,
        userWikipedia: [],
        learningPatterns: [],
      });

      // Retornar resposta
      return {
        response: cognitiveResponse.response,
        insights: cognitiveResponse.insights,
        learnings: cognitiveResponse.learnings,
      };
    }),

  /**
   * Buscar em histórico de conversas
   */
  searchConversations: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
      })
    )
    .query(async ({ ctx, input }) => {
      const conversations = await getUserConversations(ctx.user.id, 100);

      // Filtro simples por título (pode ser expandido com busca semântica)
      return conversations.filter((conv) =>
        conv.title?.toLowerCase().includes(input.query.toLowerCase())
      );
    }),
});
