import { cn } from '@/lib/utils'

interface MasteryBarProps {
  value: number
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function MasteryBar({ value, label, showLabel = true, size = 'md', className }: MasteryBarProps) {
  const clamped = Math.max(0, Math.min(100, value))

  const barColor =
    clamped >= 80 ? 'bg-emerald-500' :
    clamped >= 60 ? 'bg-blue-500' :
    clamped >= 40 ? 'bg-amber-500' :
    'bg-red-500'

  const height =
    size === 'sm' ? 'h-1.5' :
    size === 'lg' ? 'h-3' :
    'h-2'

  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-gray-600 font-medium">{label}</span>}
          {showLabel && <span className="text-xs font-semibold text-gray-700">{clamped}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', height)}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', barColor)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
