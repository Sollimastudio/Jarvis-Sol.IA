import React, { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { SolIAChatBox } from "@/components/SolIAChatBox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

/**
 * Chat Page - Interface principal da Sol.IA
 */
export default function ChatPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  // Carregar conversas do usuário
  const { data: conversationsData, isLoading: isLoadingConversations } =
    trpc.chat.getConversations.useQuery(
      { limit: 50 },
      { enabled: isAuthenticated }
    );

  // Mutation para criar nova conversa
  const createConversationMutation = trpc.chat.createConversation.useMutation({
    onSuccess: (data: any) => {
      toast.success("Nova conversa criada!");
      setCurrentConversationId(data.id);
      setConversations((prev) => [data, ...prev]);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Atualizar lista de conversas
  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
      // Se não há conversa selecionada, selecionar a primeira
      if (!currentConversationId && conversationsData.length > 0) {
        setCurrentConversationId((conversationsData[0] as any).id);
      }
    }
  }, [conversationsData]);

  const handleCreateConversation = () => {
    createConversationMutation.mutate({
      title: `Conversa ${new Date().toLocaleDateString("pt-BR")}`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Sol.IA</h2>
          <p className="text-muted-foreground mb-6">
            Você precisa estar autenticado para usar o Sol.IA. Faça login para continuar.
          </p>
          <Button onClick={() => navigate("/login")} className="w-full">
            Fazer Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Lista de Conversas */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground mb-4">Sol.IA</h1>
          <Button
            onClick={handleCreateConversation}
            disabled={createConversationMutation.isPending}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>

        {/* Conversas */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhuma conversa ainda. Crie uma nova!
            </p>
          ) : (
            conversations.map((conv: any) => (
              <button
                key={conv.id}
                onClick={() => setCurrentConversationId(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  currentConversationId === conv.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-medium truncate">{conv.title}</p>
                <p className="text-xs opacity-75">
                  {conv.messageCount || 0} mensagens
                </p>
              </button>
            ))
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-border">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversationId ? (
          <SolIAChatBox conversationId={currentConversationId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Card className="p-8 max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Bem-vindo ao Sol.IA</h2>
              <p className="text-muted-foreground mb-6">
                Crie uma nova conversa ou selecione uma existente para começar.
              </p>
              <Button onClick={handleCreateConversation} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Criar Conversa
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
