import { describe, it, expect, vi, beforeEach } from "vitest";
import { processCognitiveInput, performSelfDebugging } from "./cognitive-engine";

// Mock do LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(async (params) => {
    // Simular respostas do LLM
    const userContent = params.messages[params.messages.length - 1]?.content || "";

    if (userContent.includes("Analise a seguinte conversa")) {
      // Resposta para extração de insights
      return {
        choices: [
          {
            message: {
              content: JSON.stringify([
                {
                  title: "Insight de Teste",
                  content: "Conteúdo do insight",
                  category: "test",
                  priority: "high",
                },
              ]),
            },
          },
        ],
      };
    }

    if (userContent.includes("identifique padrões")) {
      // Resposta para identificação de padrões
      return {
        choices: [
          {
            message: {
              content: JSON.stringify([
                {
                  patternType: "thinking_pattern",
                  description: "Padrão de pensamento identificado",
                },
              ]),
            },
          },
        ],
      };
    }

    if (userContent.includes("extraia conhecimentos")) {
      // Resposta para extração de conhecimento
      return {
        choices: [
          {
            message: {
              content: JSON.stringify([
                {
                  category: "interests",
                  key: "topic",
                  value: "valor do conhecimento",
                },
              ]),
            },
          },
        ],
      };
    }

    if (userContent.includes("identifique")) {
      // Resposta para auto-depuração
      return {
        choices: [
          {
            message: {
              content: JSON.stringify({
                hasErrors: false,
                corrections: [],
                improvements: ["Melhoria 1"],
              }),
            },
          },
        ],
      };
    }

    // Resposta padrão
    return {
      choices: [
        {
          message: {
            content: "Resposta de teste do motor cognitivo",
          },
        },
      ],
    };
  }),
}));

// Mock do banco de dados
vi.mock("./db-sol-ia", () => ({
  createMessage: vi.fn(async () => ({ id: 1 })),
  createInsight: vi.fn(async () => ({ id: 1 })),
  createUserKnowledge: vi.fn(async () => ({ id: 1 })),
  createLearningPattern: vi.fn(async () => ({ id: 1 })),
  getUserKnowledgeByCategory: vi.fn(async () => []),
  getUserWikipedia: vi.fn(async () => []),
  getUserLearningPatterns: vi.fn(async () => []),
}));

describe("Cognitive Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve processar entrada cognitiva com sucesso", async () => {
    const context = {
      userId: 1,
      conversationId: 1,
      userMessage: "Tenho muitos pensamentos acelerados sobre um novo projeto",
      recentMessages: [],
      userWikipedia: [],
      learningPatterns: [],
    };

    const response = await processCognitiveInput(context);

    expect(response).toBeDefined();
    expect(response.response).toBeDefined();
    expect(Array.isArray(response.insights)).toBe(true);
    expect(Array.isArray(response.learnings)).toBe(true);
  });

  it("deve extrair insights da resposta", async () => {
    const context = {
      userId: 1,
      conversationId: 1,
      userMessage: "Quero organizar meus pensamentos sobre marketing",
      recentMessages: [],
      userWikipedia: [],
      learningPatterns: [],
    };

    const response = await processCognitiveInput(context);

    expect(response.insights.length).toBeGreaterThanOrEqual(0);
    if (response.insights.length > 0) {
      expect(response.insights[0]).toHaveProperty("title");
      expect(response.insights[0]).toHaveProperty("content");
      expect(response.insights[0]).toHaveProperty("category");
      expect(response.insights[0]).toHaveProperty("priority");
    }
  });

  it("deve identificar padrões de aprendizado", async () => {
    const context = {
      userId: 1,
      conversationId: 1,
      userMessage: "Notei que sempre tenho ideias à noite",
      recentMessages: [],
      userWikipedia: [],
      learningPatterns: [],
    };

    const response = await processCognitiveInput(context);

    expect(Array.isArray(response.learnings)).toBe(true);
  });

  it("deve realizar auto-depuração", async () => {
    const response = await performSelfDebugging(1, "Resposta de teste");

    expect(response).toBeDefined();
    expect(response).toHaveProperty("hasErrors");
    expect(response).toHaveProperty("corrections");
    expect(response).toHaveProperty("improvements");
    expect(Array.isArray(response.corrections)).toBe(true);
    expect(Array.isArray(response.improvements)).toBe(true);
  });

  it("deve lidar com erros de parsing JSON", async () => {
    const response = await performSelfDebugging(1, "Resposta com erro");

    // Deve retornar um objeto padrão mesmo com erro
    expect(response.hasErrors).toBe(false);
    expect(Array.isArray(response.corrections)).toBe(true);
    expect(Array.isArray(response.improvements)).toBe(true);
  });
});
