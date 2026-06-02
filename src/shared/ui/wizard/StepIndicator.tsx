import { Check } from 'lucide-react'
import { cn } from '@/shared/lib/cn'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-0">
      {steps.map((step, index) => {
        const isDone = index < currentStep
        const isActive = index === currentStep
        return (
          <li key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  isDone && 'border-primary bg-primary text-primary-foreground',
                  isActive && 'border-primary text-primary',
                  !isDone && !isActive && 'border-muted text-muted-foreground',
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <div className="text-center">
                <p className={cn('text-xs font-medium', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-0.5 flex-1 transition-colors',
                  index < currentStep ? 'bg-primary' : 'bg-muted',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
