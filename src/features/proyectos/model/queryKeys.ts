import type { ListarProyectosParams } from './types'

export const proyectosKeys = {
  all:      ['proyectos'] as const,
  lists:    () => [...proyectosKeys.all, 'list'] as const,
  list:     (p: ListarProyectosParams) => [...proyectosKeys.lists(), p] as const,
  details:  () => [...proyectosKeys.all, 'detail'] as const,
  detail:   (id: number) => [...proyectosKeys.details(), id] as const,
  timeline: (id: number) => [...proyectosKeys.all, 'timeline', id] as const,
}

export const contratosKeys = {
  all:    ()             => ['contratos']              as const,
  lists:  ()             => ['contratos', 'list']      as const,
  list:   (p: unknown)   => ['contratos', 'list', p]   as const,
  detail: (id: number)   => ['contratos', id]          as const,
}

export const carteraKeys = {
  all:    ()             => ['cartera']                as const,
  lists:  ()             => ['cartera', 'list']        as const,
  list:   (p: unknown)   => ['cartera', 'list', p]     as const,
  detail: (id: number)   => ['cartera', id]            as const,
}