import { invokeLLM } from "./_core/llm";
import {
  createMessage,
  createInsight,
  createUserKnowledge,
  createLearningPattern,
  getUserKnowledgeByCategory,
  getUserWikipedia,
  getUserLearningPatterns,
} from "./db-sol-ia";
import type { Message as DBMessage } from "../drizzle/schema";

/**
 * Sol.IA Cognitive Engine
 * 
 * O motor cognitivo central responsável por:
 * - Processar entradas da usuária (texto, voz)
 * - Realizar raciocínio contextual
 * - Organizar pensamentos acelerados/arbóreos
 * - Aprender e evoluir continuamente
 * - Gerar respostas e artefatos profissionais
 */

interface CognitiveContext {
  userId: number;
  conversationId: number;
  userMessage: string;
  recentMessages: DBMessage[];
  userWikipedia: any[];
  learningPatterns: any[];
}

interface CognitiveResponse {
  response: string;
  insights: Array<{
    title: string;
    content: string;
    category: string;
    priority: "low" | "medium" | "high" | "critical";
  }>;
  learnings: Array<{
    patternType: string;
    description: string;
  }>;
  artifacts?: {
    type: string;
    content: string;
  }[];
}

/**
 * Processa uma mensagem através do motor cognitivo
 */
export async function processCognitiveInput(
  context: CognitiveContext
): Promise<CognitiveResponse> {
  // 1. Construir contexto de conhecimento
  const knowledgeContext = await buildKnowledgeContext(context.userId);

  // 2. Processar mensagem com LLM
  const systemPrompt = buildSystemPrompt(context, knowledgeContext);
  const messages = buildMessageHistory(context, knowledgeContext);

  const llmResponse = await invokeLLM({
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
      { role: "user", content: context.userMessage },
    ],
  });

  const responseContent = llmResponse.choices[0]?.message?.content;
  const responseText = typeof responseContent === "string" 
    ? responseContent 
    : "Desculpe, não consegui processar sua mensagem.";

  // 3. Analisar resposta para extrair insights
  const insights = await extractInsights(context.userId, context.userMessage, responseText);

  // 4. Identificar padrões de aprendizado
  const learnings = await identifyLearningPatterns(
    context.userId,
    context.userMessage,
    responseText
  );

  // 5. Atualizar conhecimento pessoal
  await updateUserKnowledge(context.userId, context.userMessage, responseText);

  // 6. Armazenar mensagem no histórico
  await createMessage({
    conversationId: context.conversationId,
    userId: context.userId,
    role: "assistant",
    content: responseText,
        metadata: JSON.stringify({
          insightsCount: insights.length,
          learningsCount: learnings.length,
        }),
  });

  return {
    response: responseText,
    insights,
    learnings,
  };
}

/**
 * Constrói o contexto de conhecimento da usuária
 */
async function buildKnowledgeContext(userId: number) {
  const wikipedia = await getUserWikipedia(userId);
  const patterns = await getUserLearningPatterns(userId);

  return {
    wikipedia,
    patterns,
  };
}

/**
 * Constrói o prompt do sistema para o LLM
 */
function buildSystemPrompt(context: CognitiveContext, knowledgeContext: any): string {
  const basePrompt = `Você é Sol.IA, um assistente cognitivo pessoal avançado projetado para ser uma extensão mental da usuária.

Suas responsabilidades:
1. Processar e organizar pensamentos acelerados, arbóreos e insights noturnos
2. Fornecer respostas profissionais, detalhadas e de alta qualidade
3. Identificar padrões e conexões entre ideias
4. Aprender continuamente com as interações
5. Gerar artefatos ultra-profissionais quando necessário
6. Ser empático com as neurodivergências (TDAH, TAB, SPA)

Estilo de comunicação:
- Inteligente, divertido, provocativo
- Use metamodelos de linguagem
- Seja dopaminérgico e estimulante
- Atue a nível inconsciente/subliminar quando apropriado
- Sempre profissional e detalhado

Conhecimento pessoal da usuária:
${knowledgeContext.wikipedia.map((k: any) => `- ${k.category}: ${k.key} = ${k.value}`).join("\n")}

Padrões identificados:
${knowledgeContext.patterns.map((p: any) => `- ${p.patternType}: ${p.description} (confiança: ${p.confidence})`).join("\n")}`;

  return basePrompt;
}

/**
 * Constrói o histórico de mensagens para o LLM
 */
function buildMessageHistory(context: CognitiveContext, knowledgeContext: any) {
  return context.recentMessages.slice(-10).map((msg) => ({
    role: msg.role as "user" | "assistant" | "system",
    content: msg.content,
  }));
}

/**
 * Extrai insights da resposta
 */
async function extractInsights(
  userId: number,
  userMessage: string,
  response: string
): Promise<
  Array<{
    title: string;
    content: string;
    category: string;
    priority: "low" | "medium" | "high" | "critical";
  }>
> {
  // Usar LLM para extrair insights estruturados
  const insightPrompt = `Analise a seguinte conversa e extraia insights principais em formato JSON.

Mensagem da usuária: "${userMessage}"
Resposta: "${response}"

Retorne um JSON com array de insights no formato:
[
  {
    "title": "Título do insight",
    "content": "Descrição detalhada",
    "category": "categoria",
    "priority": "low|medium|high|critical"
  }
]

Retorne APENAS o JSON, sem explicações.`;

  const insightResponse = await invokeLLM({
    messages: [{ role: "user", content: insightPrompt }],
  });

  try {
    const insightContent = insightResponse.choices[0]?.message?.content;
    const insightText = typeof insightContent === "string" ? insightContent : "[]";
    const insights = JSON.parse(insightText);

    // Armazenar insights no banco de dados
    for (const insight of insights) {
      await createInsight({
        userId,
        title: insight.title,
        content: insight.content,
        category: insight.category,
        priority: insight.priority,
        actionable: insight.priority === "high" || insight.priority === "critical",
      });
    }

    return insights;
  } catch (error) {
    console.error("Erro ao extrair insights:", error);
    return [];
  }
}

/**
 * Identifica padrões de aprendizado
 */
async function identifyLearningPatterns(
  userId: number,
  userMessage: string,
  response: string
): Promise<
  Array<{
    patternType: string;
    description: string;
  }>
> {
  const patternPrompt = `Analise a seguinte conversa e identifique padrões de pensamento, comportamento ou aprendizado.

Mensagem: "${userMessage}"
Resposta: "${response}"

Retorne um JSON com array de padrões no formato:
[
  {
    "patternType": "tipo_do_padrao",
    "description": "descrição do padrão identificado"
  }
]

Retorne APENAS o JSON, sem explicações.`;

  const patternResponse = await invokeLLM({
    messages: [{ role: "user", content: patternPrompt }],
  });

  try {
    const patternContent = patternResponse.choices[0]?.message?.content;
    const patternText = typeof patternContent === "string" ? patternContent : "[]";
    const patterns = JSON.parse(patternText);

    // Armazenar padrões no banco de dados
    for (const pattern of patterns) {
      await createLearningPattern({
        userId,
        patternType: pattern.patternType,
        description: pattern.description,
        frequency: 1,
        confidence: "0.50",
      });
    }

    return patterns;
  } catch (error) {
    console.error("Erro ao identificar padrões:", error);
    return [];
  }
}

/**
 * Atualiza o conhecimento pessoal da usuária
 */
async function updateUserKnowledge(
  userId: number,
  userMessage: string,
  response: string
): Promise<void> {
  const knowledgePrompt = `Baseado na seguinte conversa, extraia conhecimentos importantes sobre a usuária que devem ser armazenados em sua Wikipedia pessoal.

Mensagem: "${userMessage}"
Resposta: "${response}"

Retorne um JSON com array de conhecimentos no formato:
[
  {
    "category": "categoria",
    "key": "chave",
    "value": "valor"
  }
]

Exemplos de categorias: "goals", "values", "preferences", "style", "interests", "strengths", "challenges"

Retorne APENAS o JSON, sem explicações.`;

  const knowledgeResponse = await invokeLLM({
    messages: [{ role: "user", content: knowledgePrompt }],
  });

  try {
    const knowledgeContent = knowledgeResponse.choices[0]?.message?.content;
    const knowledgeText = typeof knowledgeContent === "string" ? knowledgeContent : "[]";
    const knowledge = JSON.parse(knowledgeText);

    // Armazenar conhecimento no banco de dados
    for (const item of knowledge) {
      // Verificar se já existe
      const existing = await getUserKnowledgeByCategory(userId, item.category);
      const existingItem = existing.find((k: any) => k.key === item.key);

      if (existingItem) {
        // Atualizar confiança
        // TODO: Implementar update quando necessário
      } else {
        await createUserKnowledge({
          userId,
          category: item.category,
          key: item.key,
          value: item.value,
          confidence: "0.70",
        });
      }
    }
  } catch (error) {
    console.error("Erro ao atualizar conhecimento pessoal:", error);
  }
}

/**
 * Realiza auto-depuração e detecção de erros
 */
export async function performSelfDebugging(userId: number, response: string): Promise<{
  hasErrors: boolean;
  corrections: string[];
  improvements: string[];
}> {
  const debugPrompt = `Analise a seguinte resposta de IA e identifique:
1. Erros factuais ou lógicos
2. Melhorias possíveis
3. Inconsistências

Resposta: "${response}"

Retorne um JSON no formato:
{
  "hasErrors": boolean,
  "corrections": ["correção1", "correção2"],
  "improvements": ["melhoria1", "melhoria2"]
}

Retorne APENAS o JSON, sem explicações.`;

  const debugResponse = await invokeLLM({
    messages: [{ role: "user", content: debugPrompt }],
  });

  try {
    const debugContent = debugResponse.choices[0]?.message?.content;
    const debugText = typeof debugContent === "string" ? debugContent : "{}";
    return JSON.parse(debugText);
  } catch (error) {
    console.error("Erro ao realizar auto-depuração:", error);
    return {
      hasErrors: false,
      corrections: [],
      improvements: [],
    };
  }
}
