"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import { useTheme } from "@/lib/context/ThemeContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Bot, Send, User, Lightbulb, HelpCircle, ClipboardList,
  ArrowRight, Zap, BookOpen, CheckCircle2, Award, Sparkles, Terminal
} from "lucide-react"
import { useDemoStore } from "@/lib/store/demo-store"
import Link from "next/link"
import type { TutorResponseStructured } from "@/lib/ai/aiService"

// ─────────────────────────────────────────────────────────────────────────────
// Markdown renderer — adaptive code blocks for Light & Dark mode
// ─────────────────────────────────────────────────────────────────────────────
function MarkdownText({ text }: { text: string }) {
  const renderInline = (line: string, keyPrefix: string) => {
    const parts = line.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    return parts.map((part, i) => {
      const key = `${keyPrefix}-${i}`
      if (part.startsWith('**') && part.endsWith('**'))
        return <strong key={key} className="font-extrabold">{part.slice(2, -2)}</strong>
      if (part.startsWith('`') && part.endsWith('`'))
        return <code key={key} className="bg-blue-100 text-blue-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-blue-200 dark:border-cyan-500/30 rounded px-1.5 py-0.5 text-xs font-mono font-bold">{part.slice(1, -1)}</code>
      if (part.startsWith('*') && part.endsWith('*'))
        return <em key={key} className="opacity-90">{part.slice(1, -1)}</em>
      return <span key={key}>{part}</span>
    })
  }

  const elements: React.ReactNode[] = []
  const lines = text.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim().startsWith('```')) {
      const codeLines: string[] = []
      const lang = line.trim().slice(3).trim()
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <div key={`code-box-${i}`} className="my-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-[#050816] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 dark:bg-[#0b1020] border-b border-slate-700 dark:border-slate-800 text-[11px] font-mono text-cyan-300 dark:text-cyan-400">
            <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> {lang || 'Java'}</span>
            <span className="text-slate-400 dark:text-slate-500">Read-Only Scaffolding</span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed font-semibold">
            {codeLines.join('\n')}
          </pre>
        </div>
      )
    } else if (/^\d+\.\s/.test(line.trim())) {
      const num = line.trim().match(/^\d+/)?.[0]
      elements.push(
        <div key={`li-${i}`} className="flex gap-2.5 my-1">
          <span className="text-blue-600 dark:text-cyan-400 font-extrabold shrink-0 font-mono text-sm">{num}.</span>
          <span className="font-medium">{renderInline(line.trim().replace(/^\d+\.\s/, ''), `li-inline-${i}`)}</span>
        </div>
      )
    } else if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      elements.push(
        <div key={`bullet-${i}`} className="flex gap-2.5 my-1">
          <span className="text-blue-600 dark:text-cyan-400 font-bold shrink-0">•</span>
          <span className="font-medium">{renderInline(line.trim().slice(2), `bullet-inline-${i}`)}</span>
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={`gap-${i}`} className="h-2" />)
    } else {
      elements.push(
        <p key={`p-${i}`} className="leading-relaxed font-medium">
          {renderInline(line, `p-inline-${i}`)}
        </p>
      )
    }
    i++
  }

  return <div className="space-y-1 text-sm">{elements}</div>
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  responseType?: TutorResponseStructured['responseType']
  suggestedAction?: TutorResponseStructured['suggestedAction']
  isDemoMode?: boolean
  misconception?: string | null
  proofOfLearning?: {
    understanding: number
    independentReasoning: number
    aiAssistance: number
    confidence: number
  }
}

const BADGE_STYLES: Record<NonNullable<TutorResponseStructured['responseType']>, string> = {
  question: 'bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-950/90 dark:text-cyan-300 dark:border-cyan-500/40',
  hint: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/90 dark:text-amber-300 dark:border-amber-500/40',
  explanation: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/90 dark:text-purple-300 dark:border-purple-500/40',
  encouragement: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/90 dark:text-emerald-300 dark:border-emerald-500/40',
  summary: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/90 dark:text-blue-300 dark:border-blue-500/40',
}

export default function TutorPage() {
  const {
    skills, tutorHintsUsed, isDemoAIMode, isChallengeMode,
    incrementTutorHints, setDemoAIMode, completeLearningPathItem,
    toggleChallengeMode, setProofOfLearningResult
  } = useDemoStore()

  const { theme } = useTheme()

  const recursionSkill = skills.find(s => s.name === 'Recursion')
  const mastery = recursionSkill?.mastery ?? 32

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-0',
      role: 'assistant',
      content: `Hi Divakaran! We are focusing on **Recursion** today — your current mastery is **${mastery}%**. 🎯\n\nWhat part of recursion is challenging you the most? Try describing base cases or the call stack in your own words, or ask any question!`,
      responseType: 'question',
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
    }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    const lowerMsg = messageText.toLowerCase()

    // Proof-of-Learning Trigger
    if (lowerMsg.includes('code') || lowerMsg.includes('solution') || lowerMsg.includes('give me') || lowerMsg.includes('answer')) {
      setTimeout(() => {
        const proofMsg: ChatMessage = {
          id: `pol-${Date.now()}`,
          role: 'assistant',
          content: `Before I reveal the full code, let's verify what you already understand! 🎯\n\n**Proof-of-Learning Verification Challenge**:\nIn recursion, if the problem size decreases with every step, what condition must be met so the function doesn't crash with a \`StackOverflowError\`?`,
          responseType: 'question',
          suggestedAction: 'continue',
        }
        setMessages(prev => [...prev, proofMsg])
        setIsLoading(false)
      }, 700)
      return
    }

    // Evaluation of Proof-of-Learning Answer
    if (lowerMsg.includes('base case') || lowerMsg.includes('stop') || lowerMsg.includes('condition') || lowerMsg.includes('return')) {
      setTimeout(() => {
        const polResult = {
          understanding: 84,
          independentReasoning: 78,
          aiAssistance: 22,
          confidence: 82,
        }
        setProofOfLearningResult(polResult)

        const evalMsg: ChatMessage = {
          id: `pol-eval-${Date.now()}`,
          role: 'assistant',
          content: `Excellent reasoning! You correctly identified that a **base case** is required. 🎯\n\nHere is your partial code scaffolding:\n\`\`\`java\npublic int solve(int n) {\n    if (n <= 0) return 0; // Base Case verified!\n    return n + solve(n - 1); // Recursive Step\n}\n\`\`\`\nYour understanding has been verified!`,
          responseType: 'encouragement',
          suggestedAction: 'take_assessment',
          proofOfLearning: polResult,
        }
        setMessages(prev => [...prev, evalMsg])
        setIsLoading(false)
      }, 800)
      return
    }

    // API fetch
    const history = messages
      .filter(m => m.id !== 'init-0')
      .map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'model' | 'user',
        parts: [{ text: m.content }],
      }))

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: isChallengeMode ? `[CHALLENGE MODE ACTIVE - DO NOT GIVE FULL SOLUTION] ${messageText}` : messageText,
          history,
          skillName: 'Recursion',
          masteryScore: mastery,
          hintsUsed: tutorHintsUsed,
        }),
      })

      const data: TutorResponseStructured = await res.json()
      if (data.isDemoMode) setDemoAIMode(true)

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.message,
        responseType: data.responseType,
        suggestedAction: data.suggestedAction,
        isDemoMode: data.isDemoMode,
        misconception: data.misconception,
      }

      setMessages(prev => [...prev, aiMsg])
      completeLearningPathItem('lp1')
    } catch {
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: "I'm here to help! What do you already understand about recursion? Any attempt counts! 🤔",
        responseType: 'question',
        isDemoMode: true,
      }])
      setDemoAIMode(true)
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isLoading, messages, mastery, tutorHintsUsed, isChallengeMode, completeLearningPathItem, setDemoAIMode, setProofOfLearningResult])

  const handleSend = () => sendMessage(input)

  const handleQuickAction = (type: 'hint' | 'explain' | 'example' | 'problem') => {
    const prompts: Record<typeof type, string> = {
      hint: "Give me a small hint without revealing the solution.",
      explain: "Explain recursion using a simpler visual analogy.",
      example: "Show me a simple example of recursion in Java.",
      problem: "Give me a new practice challenge on recursion.",
    }
    if (type === 'hint') incrementTutorHints()
    sendMessage(prompts[type])
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-sm dark:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
              <Bot className="h-6 w-6" />
            </div>
            <span className="text-gradient-blue">SkillLoop AI Tutor</span>
            {isDemoAIMode && (
              <Badge variant="warning" className="font-mono text-xs">
                Demo AI Mode
              </Badge>
            )}
          </h1>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">
              Topic: <strong className="text-blue-600 dark:text-cyan-400 font-extrabold">Recursion</strong> · <span className="text-emerald-600 dark:text-emerald-400 font-bold">Socratic Mode</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">Mastery</span>
              <span className="text-xs font-mono font-black text-blue-600 dark:text-cyan-300">{mastery}%</span>
              <Progress value={mastery} className="w-20 h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-cyan-400" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant={isChallengeMode ? "default" : "outline"}
            size="sm"
            onClick={toggleChallengeMode}
            className={`text-xs font-extrabold h-9 px-3 ${
              isChallengeMode 
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md' 
                : 'border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100 dark:border-amber-500/50 dark:bg-amber-950/50 dark:text-amber-300'
            }`}
          >
            <Zap className="w-4 h-4 mr-1.5" /> Challenge Mode ⚡
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="border-amber-300 bg-amber-50/60 text-amber-800 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold h-9"
            onClick={() => handleQuickAction('hint')}
            disabled={isLoading}
          >
            <Lightbulb className="w-4 h-4 mr-1.5 text-amber-500" /> Request Hint
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-purple-300 bg-purple-50/60 text-purple-800 hover:bg-purple-100 dark:border-purple-500/40 dark:bg-purple-950/40 dark:text-purple-300 text-xs font-bold h-9"
            onClick={() => handleQuickAction('explain')}
            disabled={isLoading}
          >
            <HelpCircle className="w-4 h-4 mr-1.5 text-purple-500" /> Explain Concept
          </Button>
          <Button asChild size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs h-9 shadow-md">
            <Link href="/assessment">
              Take Assessment <ClipboardList className="w-4 h-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Challenge Mode Banner */}
      {isChallengeMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-gradient-to-r dark:from-amber-950/80 dark:to-amber-900/80 dark:border-amber-500/60 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shadow-sm">
          <span className="flex items-center gap-2 font-bold">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            Challenge Mode Active — Solve independently. SkillLoop AI will guide, not solve.
          </span>
          <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">Assistance: Minimal</span>
        </div>
      )}

      {/* ── Main Layout ─────────────────────────────────────────────── */}
      <div className="flex gap-5 flex-1 overflow-hidden min-h-0">
        {/* Chat Window */}
        <Card className="flex-1 flex flex-col overflow-hidden glass-card min-w-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white'
                }`}>
                  {m.role === 'user' ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                <div className="flex flex-col gap-2 max-w-[82%]">
                  {m.role === 'assistant' && m.responseType && (
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-mono font-bold border uppercase tracking-wider ${BADGE_STYLES[m.responseType]}`}>
                        {m.responseType}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-100 border border-slate-200 text-slate-900 dark:bg-gradient-to-br dark:from-blue-950/70 dark:to-[#060a18] dark:border-blue-500/40 dark:text-white rounded-tl-none'
                  }`}>
                    <MarkdownText text={m.content} />
                  </div>

                  {/* Proof of Learning Scorecard */}
                  {m.proofOfLearning && (
                    <div className="mt-2 p-5 bg-emerald-50 border border-emerald-200 dark:bg-gradient-to-br dark:from-emerald-950/60 dark:to-[#050816] dark:border-emerald-500/50 rounded-2xl space-y-3 shadow-sm">
                      <div className="flex items-center gap-2 font-black text-xs text-emerald-800 dark:text-emerald-300 uppercase tracking-widest font-mono">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Learning Verification Scorecard
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs pt-1">
                        <div className="p-2.5 bg-white dark:bg-[#050816] rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">Understanding</span>
                          <p className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono mt-0.5">{m.proofOfLearning.understanding}%</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#050816] rounded-xl border border-emerald-200 dark:border-emerald-500/30">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">Reasoning</span>
                          <p className="font-black text-emerald-600 dark:text-emerald-400 text-base font-mono mt-0.5">{m.proofOfLearning.independentReasoning}%</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#050816] rounded-xl border border-blue-200 dark:border-blue-500/30">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">AI Assistance</span>
                          <p className="font-black text-blue-600 dark:text-cyan-400 text-base font-mono mt-0.5">{m.proofOfLearning.aiAssistance}%</p>
                        </div>
                        <div className="p-2.5 bg-white dark:bg-[#050816] rounded-xl border border-purple-200 dark:border-purple-500/30">
                          <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">Confidence</span>
                          <p className="font-black text-purple-600 dark:text-purple-400 text-base font-mono mt-0.5">{m.proofOfLearning.confidence}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CTA: Go to assessment */}
                  {m.role === 'assistant' && m.suggestedAction === 'take_assessment' && (
                    <div className="mt-1">
                      <Button asChild size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs h-9 shadow-sm">
                        <Link href="/assessment">
                          Take Assessment <ArrowRight className="w-4 h-4 ml-1.5" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950/70 dark:border-blue-500/40 rounded-2xl rounded-tl-none px-4 py-3 flex gap-2 items-center text-xs text-blue-700 dark:text-cyan-300 font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1">Synthesizing Socratic Hint...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-slate-50 dark:bg-[#050816] border-t border-slate-200 dark:border-slate-800 transition-colors">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder={isChallengeMode ? "Challenge Mode active... Type your independent reasoning" : "Message AI Tutor (ask for hints, trace recursion)..."}
                className="w-full h-12 pl-5 pr-14 rounded-2xl bg-white dark:bg-[#080B18] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm font-medium"
              />
              <Button
                size="icon"
                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white shadow-sm"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* ── Context Panel (desktop only) ─────────────────────────── */}
        <div className="w-60 hidden xl:flex flex-col gap-4 shrink-0">
          <Card className="p-5 glass-card">
            <h3 className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" /> Session Context
            </h3>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-700 dark:text-slate-300 font-bold">Recursion Mastery</span>
                  <span className="font-mono font-black text-blue-600 dark:text-cyan-300">{mastery}%</span>
                </div>
                <Progress value={mastery} className="h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-cyan-400" />
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Hints Used</span>
                <Badge variant="secondary" className="font-mono font-bold text-xs">{tutorHintsUsed}</Badge>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-slate-600 dark:text-slate-300 font-medium">AI Assistance</span>
                <Badge variant="success" className="font-mono font-bold text-xs">Low (22%)</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-900/90 dark:to-cyan-950/90 text-white border-none shadow-md">
            <h3 className="text-sm font-extrabold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-200" /> Proof-of-Learning
            </h3>
            <p className="text-xs text-blue-50 dark:text-slate-200 mb-3.5 leading-relaxed">
              Verify your comprehension through adaptive questions to unlock real projects.
            </p>
            <Button asChild size="sm" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-black text-xs h-9 shadow-sm">
              <Link href="/assessment">
                Start Assessment <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}
