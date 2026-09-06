"use client"
import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/lib/context/ThemeContext"
import { 
  Bot, Send, X, Minus, RotateCcw, Sparkles, Compass, 
  HelpCircle, MessageSquare, ChevronDown 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PAGE_CONTEXT_REGISTRY, getWebsiteAssistantResponse } from "@/lib/services/websiteHelpService"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const QUICK_PROMPTS = [
  "How do I use AI Tutor?",
  "How does assessment work?",
  "Why is my project locked?",
  "How do I switch themes?",
  "How do I access Teacher View?",
]

export function WebsiteHelpAssistant() {
  const pathname = usePathname()
  const { theme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const currentPage = PAGE_CONTEXT_REGISTRY[pathname] || {
    name: "SkillLoop AI Platform",
    summary: "AI-powered learning intelligence platform."
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `Hello! I am your **SkillLoop AI Website Assistant** 👋

I can help you navigate this platform, demo features, and understand the learning flow.

You are currently on the **${currentPage.name}**. What would you like help with?`
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isMinimized])

  const handleSendMessage = async (textToSend?: string) => {
    const userText = (textToSend || input).trim()
    if (!userText || isLoading) return

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText
    }

    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      // First try calling API endpoint with Gemini
      const res = await fetch("/api/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          currentPath: pathname
        })
      })

      const data = await res.json()
      const answer = data.answer || getWebsiteAssistantResponse(userText, pathname)

      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: answer
        }
      ])
    } catch {
      // Instant local knowledge fallback
      const localAnswer = getWebsiteAssistantResponse(userText, pathname)
      setMessages(prev => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: localAnswer
        }
      ])
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content: `Chat history cleared. I'm here to help you navigate **SkillLoop AI**! Feel free to ask any question or select a prompt below.`
      }
    ])
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setIsMinimized(false); }}
          className="group relative flex items-center gap-3 p-3.5 bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all duration-300 hover:scale-105"
          aria-label="SkillLoop AI Help Assistant"
        >
          <div className="h-7 w-7 bg-white/20 rounded-xl flex items-center justify-center font-extrabold text-white text-base">
            S
          </div>
          <span className="font-extrabold text-sm tracking-wide hidden sm:inline-block pr-1">
            SkillLoop Help
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-900 animate-pulse" />
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div
          className={`w-[92vw] sm:w-[400px] transition-all duration-300 shadow-2xl rounded-3xl border flex flex-col overflow-hidden ${
            isMinimized ? "h-14" : "h-[540px] max-h-[85vh]"
          } ${
            theme === "dark"
              ? "bg-[#080B18]/95 border-slate-800 text-white backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)]"
              : "bg-white/95 border-slate-200 text-slate-900 backdrop-blur-2xl shadow-2xl"
          }`}
        >
          {/* Header */}
          <div
            className={`px-4 py-3.5 flex items-center justify-between border-b cursor-pointer select-none ${
              theme === "dark"
                ? "bg-[#050816]/90 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-extrabold text-xs shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                S
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 font-extrabold text-xs tracking-tight truncate">
                  <span>✦ SkillLoop AI</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    theme === "dark" ? "bg-cyan-950 text-cyan-300 border border-cyan-500/30" : "bg-blue-100 text-blue-700"
                  }`}>
                    Assistant
                  </span>
                </div>
                <span className={`text-[10px] truncate ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                  Current: {currentPage.name}
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? "Expand" : "Minimize"}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark" ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark" ? "text-slate-400 hover:text-red-400 hover:bg-red-950/40" : "text-slate-500 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                        m.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gradient-to-tr from-blue-600 to-cyan-400 text-white"
                      }`}
                    >
                      {m.role === "user" ? "U" : "S"}
                    </div>

                    <div
                      className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] leading-relaxed ${
                        m.role === "user"
                          ? "bg-blue-600 text-white rounded-tr-none"
                          : theme === "dark"
                          ? "bg-[#0b1020] border border-slate-800 text-slate-100 rounded-tl-none"
                          : "bg-slate-100 border border-slate-200 text-slate-800 rounded-tl-none"
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-2.5 items-center">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center text-xs font-bold">
                      S
                    </div>
                    <div className={`px-3 py-2 rounded-xl rounded-tl-none border text-[11px] font-mono flex items-center gap-1.5 ${
                      theme === "dark" ? "bg-[#0b1020] border-slate-800 text-cyan-400" : "bg-slate-100 border-slate-200 text-blue-600"
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                      <span>Searching SkillLoop knowledge...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className={`p-2.5 border-t border-b overflow-x-auto flex gap-1.5 text-[11px] no-scrollbar ${
                theme === "dark" ? "bg-[#050816]/70 border-slate-800/80" : "bg-slate-50 border-slate-200"
              }`}>
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSendMessage(prompt)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-full border transition-all ${
                      theme === "dark"
                        ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
                        : "bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className={`p-3 border-t ${
                theme === "dark" ? "bg-[#050816] border-slate-800" : "bg-white border-slate-200"
              }`}>
                <div className="relative flex items-center">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask how to use SkillLoop AI..."
                    className={`w-full pl-3.5 pr-10 py-2 rounded-xl text-xs outline-none border transition-all ${
                      theme === "dark"
                        ? "bg-[#080B18] border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400"
                        : "bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-600"
                    }`}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-opacity"
                    title="Send message"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
