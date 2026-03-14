import React, { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send, Mic, MicOff } from "lucide-react";
import { Streamdown } from "streamdown";
import { toast } from "sonner";

interface Message {
  id?: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  insights?: Array<{
    title: string;
    content: string;
    category: string;
    priority: string;
  }>;
}

interface SolIAChatBoxProps {
  conversationId: number;
}

/**
 * Sol.IA Chat Box Component
 * Interface conversacional para interagir com o motor cognitivo
 */
export function SolIAChatBox({ conversationId }: SolIAChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Carregar conversa ao montar
  const { data: conversationData } = trpc.chat.getConversation.useQuery({
    conversationId,
  });

  // Mutation para enviar mensagem
  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: (data) => {
      // Adicionar resposta do assistente
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
          insights: data.insights,
          timestamp: new Date(),
        },
      ]);
      setInputValue("");
      setIsLoading(false);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
      setIsLoading(false);
    },
  });

  // Carregar mensagens da conversa
  useEffect(() => {
    if (conversationData?.messages) {
      const formattedMessages = conversationData.messages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content,
        timestamp: msg.createdAt,
      }));
      setMessages(formattedMessages);
    }
  }, [conversationData]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Inicializar reconhecimento de fala
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "pt-BR";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInputValue((prev) => prev + transcript);
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        toast.error(`Erro de reconhecimento: ${event.error}`);
        setIsListening(false);
      };
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      toast.error("Digite uma mensagem");
      return;
    }

    // Adicionar mensagem do usuário
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: inputValue,
        timestamp: new Date(),
      },
    ]);

    setIsLoading(true);

    // Enviar para o servidor
    sendMessageMutation.mutate({
      conversationId,
      message: inputValue,
    });
  };

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast.error("Reconhecimento de fala não suportado");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background rounded-lg border border-border">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Bem-vinda ao Sol.IA</h3>
              <p className="text-sm text-muted-foreground">
                Comece digitando seus pensamentos, ideias ou perguntas. Estou aqui para ajudar a
                organizar seu caos mental.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Streamdown>{msg.content}</Streamdown>

                {/* Insights */}
                {msg.insights && msg.insights.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-current border-opacity-20 space-y-2">
                    <p className="text-xs font-semibold opacity-75">Insights Identificados:</p>
                    {msg.insights.map((insight, i) => (
                      <div key={i} className="text-xs opacity-90">
                        <p className="font-semibold">{insight.title}</p>
                        <p className="opacity-75">{insight.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {msg.timestamp && (
                  <p className="text-xs opacity-50 mt-2">
                    {msg.timestamp.toLocaleTimeString("pt-BR")}
                  </p>
                )}
              </Card>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted px-4 py-2">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Sol.IA está pensando...</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 space-y-2">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu pensamento, insight ou pergunta..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={toggleVoiceInput}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            disabled={isLoading}
            title={isListening ? "Parar de ouvir" : "Ativar voz"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Pressione Enter para enviar • Clique no microfone para ativar voz
        </p>
      </div>
    </div>
  );
}
