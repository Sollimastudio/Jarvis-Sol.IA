import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Brain, Zap, Mic, BookOpen, TrendingUp, Sparkles } from "lucide-react";

/**
 * Landing Page - Sol.IA
 * Página inicial com instruções e call-to-action
 */
export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        {/* Header */}
        <div className="border-b border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-foreground">Sol.IA</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.name}</span>
              <Button onClick={() => navigate("/chat")} size="lg">
                Abrir Chat
              </Button>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Bem-vinda ao Sol.IA
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Seu segundo cérebro cognitivo. Organize seus pensamentos acelerados, capture insights
              noturnos e deixe a IA trabalhar para você.
            </p>
            <Button onClick={() => navigate("/chat")} size="lg" className="text-lg px-8 py-6">
              Começar Agora
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {/* Feature 1 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Brain className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Motor Cognitivo Avançado</h3>
                  <p className="text-sm text-muted-foreground">
                    Processamento de linguagem natural que entende nuances, contexto e emoções. Perfeito
                    para organizar pensamentos acelerados e arbóreos.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Mic className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Entrada por Voz</h3>
                  <p className="text-sm text-muted-foreground">
                    Capture seus insights noturnos sem sair da cama. Apenas fale e a Sol.IA registra,
                    organiza e analisa tudo.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <BookOpen className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Wikipedia Pessoal</h3>
                  <p className="text-sm text-muted-foreground">
                    Construa automaticamente sua base de conhecimento pessoal. A Sol.IA aprende sobre
                    você e suas preferências.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Zap className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Aprendizado Contínuo</h3>
                  <p className="text-sm text-muted-foreground">
                    Evolui com você. Quanto mais você conversa, mais inteligente e personalizada a
                    Sol.IA fica.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 5 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <TrendingUp className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Análise de Padrões</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifica padrões em seus pensamentos, comportamentos e decisões. Fornece insights
                    profundos sobre você.
                  </p>
                </div>
              </div>
            </Card>

            {/* Feature 6 */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Geração de Artefatos</h3>
                  <p className="text-sm text-muted-foreground">
                    Cria posts, artigos, roteiros e conteúdos profissionais no seu estilo. Pronto para
                    publicar.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* How to Use Section */}
          <div className="bg-muted/50 rounded-lg p-8 mb-16">
            <h3 className="text-2xl font-bold text-foreground mb-8">Como Usar</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-4">
                  1
                </div>
                <h4 className="font-semibold text-foreground mb-2">Abra o Chat</h4>
                <p className="text-sm text-muted-foreground">
                  Clique em "Começar Agora" ou "Abrir Chat" para iniciar uma conversa.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-4">
                  2
                </div>
                <h4 className="font-semibold text-foreground mb-2">Digite ou Fale</h4>
                <p className="text-sm text-muted-foreground">
                  Compartilhe seus pensamentos, ideias ou perguntas. Use voz para capturar insights
                  noturnos.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-4">
                  3
                </div>
                <h4 className="font-semibold text-foreground mb-2">Receba Análise</h4>
                <p className="text-sm text-muted-foreground">
                  A Sol.IA processa, organiza e extrai insights de suas mensagens automaticamente.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center font-bold mx-auto mb-4">
                  4
                </div>
                <h4 className="font-semibold text-foreground mb-2">Aprenda e Evolua</h4>
                <p className="text-sm text-muted-foreground">
                  A Sol.IA aprende com você e fica cada vez mais inteligente e personalizada.
                </p>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="p-6 border-2 border-primary/20">
              <h4 className="font-semibold text-foreground mb-4">💡 Dicas para Melhor Uso</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Seja específico e detalhado em suas mensagens</li>
                <li>• Use a entrada de voz para capturar pensamentos espontâneos</li>
                <li>• Compartilhe seus objetivos e valores para personalização</li>
                <li>• Revise os insights gerados para refinar o aprendizado</li>
                <li>• Use múltiplas conversas para organizar diferentes tópicos</li>
              </ul>
            </Card>

            <Card className="p-6 border-2 border-primary/20">
              <h4 className="font-semibold text-foreground mb-4">🎯 Casos de Uso</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Organizar pensamentos acelerados (TDAH, TAB, SPA)</li>
                <li>• Capturar e estruturar ideias criativas</li>
                <li>• Análise de padrões de comportamento</li>
                <li>• Geração de conteúdo profissional</li>
                <li>• Planejamento estratégico e tomada de decisão</li>
              </ul>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Pronto para Começar?</h3>
            <p className="text-lg text-muted-foreground mb-8">
              Abra o chat e comece a conversar com seu segundo cérebro cognitivo agora.
            </p>
            <Button onClick={() => navigate("/chat")} size="lg" className="text-lg px-8 py-6">
              Abrir Chat Agora
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border mt-16 py-8">
          <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>Sol.IA © 2026 - Seu Ecossistema Cognitivo Pessoal</p>
          </div>
        </div>
      </div>
    );
  }

  // Página para usuários não autenticados
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Sol.IA</h1>
          <Button onClick={() => window.location.href = getLoginUrl()}>
            Fazer Login
          </Button>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Seu Segundo Cérebro Cognitivo
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Sol.IA é um assistente de IA pessoal avançado projetado para ser uma extensão de sua
            mente. Organize pensamentos acelerados, capture insights noturnos e deixe a IA trabalhar
            para você.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <div className="text-center">
              <Brain className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Motor Cognitivo</p>
            </div>
            <div className="text-center">
              <Mic className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Entrada por Voz</p>
            </div>
            <div className="text-center">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">Aprendizado Contínuo</p>
            </div>
          </div>

          <Button onClick={() => window.location.href = getLoginUrl()} size="lg" className="text-lg px-8 py-6">
            Começar Agora
          </Button>

          <p className="text-sm text-muted-foreground mt-8">
            Faça login para acessar seu assistente pessoal
          </p>
        </div>
      </div>
    </div>
  );
}
