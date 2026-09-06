"use client"
import { useState } from "react"
import { useDemoStore, calculateUpdatedMastery, PROJECT_UNLOCK_THRESHOLD } from "@/lib/store/demo-store"
import { RECURSION_QUESTIONS } from "@/lib/data/seed"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle2, XCircle, BrainCircuit, ArrowRight,
  Lightbulb, RotateCcw, Sparkles, TrendingUp
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-500/40',
  medium: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-500/40',
  hard: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-950/80 dark:text-red-300 dark:border-red-500/40',
}

function ResultsScreen({ result }: {
  result: {
    masteryBefore: number
    masteryAfter: number
    assessmentScore: number
    hintsUsed: number
    totalQuestions: number
    correctAnswers: number
  }
}) {
  const router = useRouter()
  const delta = result.masteryAfter - result.masteryBefore
  const projectUnlocked = result.masteryAfter >= PROJECT_UNLOCK_THRESHOLD

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      {/* Celebration Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto w-20 h-20 bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mb-4 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">Assessment Complete!</h2>
        <p className="text-slate-600 dark:text-slate-300 font-medium">
          You answered <strong className="text-blue-600 dark:text-cyan-400">{result.correctAnswers}</strong> of {result.totalQuestions} questions correctly.
        </p>
      </div>

      {/* Mastery Update Card */}
      <Card className="glass-card border-emerald-300 bg-emerald-50/50 dark:border-emerald-500/40 dark:bg-emerald-950/20 shadow-sm overflow-hidden">
        <CardContent className="p-7">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">Recursion Mastery Updated</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <div className="text-center">
              <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Before</p>
              <p className="text-4xl font-extrabold text-slate-400 dark:text-slate-500 line-through font-mono">{result.masteryBefore}%</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <ArrowRight className="h-7 w-7 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-500/30">+{delta}%</span>
            </div>
            <div className="text-center">
              <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">After</p>
              <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{result.masteryAfter}%</p>
            </div>
          </div>
          <Progress value={result.masteryAfter} className="mt-6 h-3 bg-slate-200 dark:bg-slate-800 [&>div]:bg-emerald-500" />
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Score</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{result.assessmentScore}%</p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Correct</p>
            <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono">{result.correctAnswers}/{result.totalQuestions}</p>
          </CardContent>
        </Card>
        <Card className={result.hintsUsed > 0 ? 'glass-card border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/20' : 'glass-card border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-950/20'}>
          <CardContent className="p-4 text-center">
            <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">Hints Used</p>
            <p className={`text-2xl font-black font-mono ${result.hintsUsed > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {result.hintsUsed}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Unlock / CTA */}
      {projectUnlocked ? (
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-900/90 dark:via-indigo-900/90 dark:to-cyan-900/90 text-white border-none shadow-md">
          <CardContent className="p-7 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-200 animate-pulse" />
              <h3 className="font-extrabold text-xl">Maze Solver Project Ready to Build! 🚀</h3>
            </div>
            <p className="text-blue-50 dark:text-slate-200 text-sm leading-relaxed">
              Your Recursion mastery has reached <strong className="text-white font-mono">{result.masteryAfter}%</strong>. The <em className="font-bold">Maze Solver using Recursion</em> project is now unlocked.
            </p>
            <Button asChild size="lg" className="w-full h-12 bg-white text-blue-700 hover:bg-blue-50 font-black shadow-sm">
              <Link href="/projects">
                Open Project Workspace →
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
              Keep Practicing!
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              You need <strong className="text-blue-600 dark:text-cyan-400 font-mono">{PROJECT_UNLOCK_THRESHOLD - result.masteryAfter}% more mastery</strong> to reach the project unlock threshold.
            </p>
            <div className="flex gap-3 pt-2">
              <Button asChild variant="outline" className="flex-1 border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                <Link href="/tutor">Back to Tutor</Link>
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                onClick={() => router.refresh()}
              >
                <RotateCcw className="w-4 h-4 mr-2" /> Retry Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function AssessmentPage() {
  const { skills, completeAssessment } = useDemoStore()
  const recursionSkill = skills.find(s => s.name === 'Recursion')
  const masteryBefore = recursionSkill?.mastery ?? 32

  const questions = RECURSION_QUESTIONS.slice(0, 5)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [hintVisible, setHintVisible] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<null | {
    masteryBefore: number
    masteryAfter: number
    assessmentScore: number
    hintsUsed: number
    totalQuestions: number
    correctAnswers: number
  }>(null)

  const currentQ = questions[currentIndex]

  const handleSubmit = () => {
    if (!selected) return
    setIsSubmitted(true)
    if (selected === currentQ.correctAnswerId) {
      setCorrectCount(c => c + 1)
    }
  }

  const handleHint = () => {
    if (!hintVisible) {
      setHintVisible(true)
      setHintsUsed(h => h + 1)
    }
  }

  const handleNext = () => {
    const isLast = currentIndex === questions.length - 1

    if (!isLast) {
      setCurrentIndex(i => i + 1)
      setSelected(null)
      setIsSubmitted(false)
      setHintVisible(false)
    } else {
      const finalCorrectCount = isSubmitted && selected === currentQ.correctAnswerId
        ? correctCount
        : correctCount

      const computedCorrect = finalCorrectCount + (selected === currentQ.correctAnswerId && isSubmitted ? 0 : 0)
      const totalScore = Math.round((computedCorrect / questions.length) * 100)

      const newMastery = calculateUpdatedMastery({
        previousMastery: masteryBefore,
        assessmentScore: totalScore,
        hintsUsed,
        totalQuestions: questions.length,
      })

      completeAssessment({
        skillId: 'java-recursion',
        assessmentScore: totalScore,
        hintsUsed,
        totalQuestions: questions.length,
      })

      setResult({
        masteryBefore,
        masteryAfter: newMastery,
        assessmentScore: totalScore,
        hintsUsed,
        totalQuestions: questions.length,
        correctAnswers: computedCorrect,
      })
    }
  }

  const storedRecursion = skills.find(s => s.name === 'Recursion')

  if (result) {
    const actualMasteryAfter = storedRecursion?.mastery ?? result.masteryAfter
    return <ResultsScreen result={{ ...result, masteryAfter: actualMasteryAfter }} />
  }

  const progressPct = Math.round((currentIndex / questions.length) * 100)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with BOLD TOPIC */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Adaptive Skill Verification</h1>
          <p className="text-blue-600 dark:text-cyan-400 font-mono text-sm mt-1 font-bold">Topic: Recursion · {questions.length} Questions</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-slate-400">
            Question {currentIndex + 1} of {questions.length}
          </p>
          <Progress value={progressPct} className="w-36 mt-1.5 h-2 bg-slate-200 dark:bg-slate-800 [&>div]:bg-cyan-400" />
        </div>
      </div>

      {/* Question Card */}
      <Card className="glass-card overflow-hidden shadow-xl">
        <CardHeader className="bg-slate-50 dark:bg-[#050816]/70 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex justify-between items-start mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-full border font-mono font-bold ${DIFFICULTY_STYLES[currentQ.difficulty]}`}>
              {currentQ.difficulty.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold uppercase">{currentQ.topic}</span>
          </div>
          <CardTitle className="text-lg leading-relaxed font-bold text-slate-900 dark:text-white whitespace-pre-line">
            {currentQ.text}
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-3">
          {currentQ.options?.map((opt) => {
            const isSelected = selected === opt.id
            const isCorrect = opt.id === currentQ.correctAnswerId

            let cls = "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050816]/60 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200"
            if (isSubmitted) {
              if (isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
              else if (isSelected && !isCorrect) cls = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300"
              else cls = "border-slate-200 dark:border-slate-800 opacity-40 text-slate-400"
            } else if (isSelected) {
              cls = "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-white ring-1 ring-blue-500"
            }

            return (
              <button
                key={opt.id}
                disabled={isSubmitted}
                onClick={() => setSelected(opt.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center gap-4 ${cls}`}
              >
                <span className={`text-sm ${isSubmitted && isCorrect ? 'font-bold text-emerald-800 dark:text-emerald-300' : 'font-medium'}`}>
                  <span className="text-blue-600 dark:text-cyan-400 font-mono font-bold text-xs mr-2">{opt.id.toUpperCase()}.</span>
                  {opt.text}
                </span>
                {isSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                {isSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />}
              </button>
            )
          })}

          {/* Hint */}
          {!isSubmitted && currentQ.hint && (
            <div className="pt-2">
              {hintVisible ? (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-500/40 flex gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-amber-900 dark:text-amber-200 leading-relaxed">{currentQ.hint}</p>
                </div>
              ) : (
                <button
                  onClick={handleHint}
                  className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5 font-bold font-mono"
                >
                  <Lightbulb className="w-3.5 h-3.5" /> Request Concept Hint
                </button>
              )}
            </div>
          )}

          {/* Explanation */}
          {isSubmitted && (
            <div className={`mt-4 p-4 rounded-xl flex gap-3 border ${
              selected === currentQ.correctAnswerId
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/40 dark:text-emerald-200'
                : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/40 dark:border-blue-500/40 dark:text-blue-200'
            }`}>
              <BrainCircuit className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-cyan-400" />
              <div>
                <p className="font-bold text-sm mb-1 text-slate-900 dark:text-white">
                  {selected === currentQ.correctAnswerId ? '✓ Correct Reasoning!' : 'Concept Breakdown:'}
                </p>
                <p className="text-xs opacity-90 leading-relaxed font-medium">{currentQ.explanation}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-slate-50 dark:bg-[#050816]/70 border-t border-slate-200 dark:border-slate-800 pt-5 flex justify-between items-center">
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {hintsUsed > 0 ? `${hintsUsed} hint${hintsUsed > 1 ? 's' : ''} used` : 'No hints used'}
          </p>
          {!isSubmitted ? (
            <Button onClick={handleSubmit} disabled={!selected} size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-md">
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext} size="lg" className="px-8 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold shadow-md">
              {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
