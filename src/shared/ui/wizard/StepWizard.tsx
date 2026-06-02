import { useState } from 'react'
import type { ReactNode } from 'react'
import type { ZodSchema } from 'zod'
import { StepIndicator } from './StepIndicator'
import { StepActions } from './StepActions'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export interface StepDefinition {
  id: string
  title: string
  description?: string
  schema?: ZodSchema
  component: ReactNode
}

interface StepWizardProps {
  steps: StepDefinition[]
  onComplete: () => void
  onCancel?: () => void
  isSubmitting?: boolean
}

export function StepWizard({ steps, onComplete, onCancel, isSubmitting = false }: StepWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  const step = steps[currentStep]
  if (!step) return null

  const isLastStep = currentStep === steps.length - 1

  const handleNext = async () => {
    setErrors([])
    if (step.schema) {
      const result = step.schema.safeParse({})
      if (!result.success) {
        setErrors(result.error.errors.map((e) => e.message))
        return
      }
    }
    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setErrors([])
    setCurrentStep((s) => s - 1)
  }

  return (
    <Card>
      <CardHeader>
        <StepIndicator steps={steps} currentStep={currentStep} />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {errors.length > 0 && (
          <ul className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        )}
        <div>{step.component}</div>
        <StepActions
          currentStep={currentStep}
          totalSteps={steps.length}
          onNext={handleNext}
          onBack={handleBack}
          // ✅ exactOptionalPropertyTypes: pasar onCancel solo si está definido
          // Nunca pasar { onCancel: undefined } — omitir la prop completamente
          {...(onCancel !== undefined ? { onCancel } : {})}
          isLastStep={isLastStep}
          isSubmitting={isSubmitting}
        />
      </CardContent>
    </Card>
  )
}