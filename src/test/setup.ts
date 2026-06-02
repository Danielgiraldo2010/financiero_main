// @testing-library/jest-dom extiende expect() de Vitest con matchers como
// toBeInTheDocument(), toHaveValue(), toBeVisible(), etc.
// Requiere: pnpm add -D @testing-library/jest-dom
import '@testing-library/jest-dom/vitest'
import { beforeAll, afterAll } from 'vitest'

const originalError = console.error
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('ReactDOM.render'))
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})
afterAll(() => {
  console.error = originalError
})