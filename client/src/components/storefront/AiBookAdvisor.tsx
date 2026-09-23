import React, { useState, useRef, useEffect } from "react";
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "De quoi traite le livre de Kotler ?",
  "Quels sont les 7 cas tunisiens inclus ?",
  "Combien coûte la livraison en Tunisie ?",
  "Comment fonctionne le paiement à la livraison ?",
];

export function AiBookAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour ! Je suis le **Conseiller IA de LivresPro.tn**. Posez-moi vos questions sur le livre *B2B Brand Management — Édition Tunisie*, les 7 cas d'entreprises tunisiennes ou les modalités de livraison partout en Tunisie.",
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { openCart } = useCart();

  const askMutation = trpc.site.ai.ask.useMutation();

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || askMutation.isPending) return;

    const newHistory: Message[] = [...messages, { role: "user", content: query }];
    setMessages(newHistory);
    setInput("");

    try {
      const res = await askMutation.mutateAsync({
        message: query,
        history: newHistory.map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Le livre phare « B2B Brand Management — Édition Tunisie » est disponible au tarif de lancement de 65,00 DT avec livraison rapide 24-48h et paiement à la livraison partout en Tunisie. Vous pouvez nous joindre également sur WhatsApp au +216 29 511 111.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#0a192f] text-amber-300 font-medium text-sm rounded-full shadow-2xl hover:bg-[#132742] hover:scale-105 transition-all duration-200 border border-amber-400/30"
          aria-label="Ouvrir le conseiller IA LivresPro"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Conseiller IA</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[92vw] max-w-md h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#0a192f] text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 border border-amber-400/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-stone-100 flex items-center gap-1.5">
                  Conseiller IA LivresPro
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300">
                    B2B Tunisie
                  </span>
                </h3>
                <p className="text-xs text-stone-400">En direct • Réponse instantanée</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/70 text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-300 flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[82%] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#0a192f] text-white rounded-br-sm"
                      : "bg-white text-stone-800 border border-stone-200 shadow-sm rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center shrink-0 text-xs mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {askMutation.isPending && (
              <div className="flex gap-2.5 items-center text-xs text-stone-500 italic py-1">
                <div className="w-7 h-7 rounded-full bg-[#0a192f] text-amber-300 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span>Le Conseiller IA formule sa réponse...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-stone-100 border-t border-stone-200 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                disabled={askMutation.isPending}
                className="text-xs bg-white text-stone-700 hover:text-[#0a192f] hover:bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200 shrink-0 transition-colors shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question sur le livre ou la livraison..."
              className="flex-1 text-sm bg-stone-100 rounded-xl px-3.5 py-2.5 border border-transparent focus:border-stone-300 focus:bg-white focus:outline-hidden transition-all text-stone-900"
            />
            <button
              type="submit"
              disabled={!input.trim() || askMutation.isPending}
              className="p-2.5 bg-[#0a192f] hover:bg-[#132742] disabled:opacity-40 text-amber-300 rounded-xl transition-all shadow-sm"
              aria-label="Envoyer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Call to Action */}
          <div className="bg-stone-50 px-4 py-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500">65,00 DT • En stock</span>
            <button
              onClick={() => {
                setIsOpen(false);
                openCart();
              }}
              className="font-medium text-[#0a192f] hover:text-amber-700 flex items-center gap-1"
            >
              Voir mon panier <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
