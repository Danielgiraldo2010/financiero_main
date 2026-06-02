/// <reference types="vite/client" />

// Declaraciones de módulos para assets manejados por Vite.
// Esto resuelve "Cannot find module or type declarations for side-effect import of '*.css'"

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

declare module '*.svg' {
  import type { FunctionComponent, SVGProps } from 'react'
  const ReactComponent: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>
  export default ReactComponent
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}
