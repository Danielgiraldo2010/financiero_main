import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/shared/ui/feedback/LoadingSpinner'

interface StepActionsProps {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  onCancel?: () => void
  isLastStep: boolean
  isSubmitting?: boolean
  nextLabel?: string
  completeLabel?: string
}

export function StepActions({
  currentStep,
  onNext,
  onBack,
  onCancel,
  isLastStep,
  isSubmitting = false,
  nextLabel = 'Siguiente',
  completeLabel = 'Finalizar',
}: StepActionsProps) {
  return (
    <div className="flex justify-between pt-4">
      <div className="flex gap-2">
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
        )}
        {currentStep > 0 && (
          <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
            Atrás
          </Button>
        )}
      </div>
      <Button onClick={onNext} disabled={isSubmitting}>
        {isSubmitting ? (
          <LoadingSpinner size="sm" />
        ) : isLastStep ? (
          completeLabel
        ) : (
          nextLabel
        )}
      </Button>
    </div>
  )
}
