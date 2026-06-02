interface ErrorMessageProps {
  message?: string
}

export function ErrorMessage({
  message = "Ocurrio un error inesperado.",
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2">
      <p className="text-sm text-destructive font-medium">{message}</p>
    </div>
  )
}
