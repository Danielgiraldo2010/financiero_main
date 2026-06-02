export const agendaKeys = {
  all: ["agenda"] as const,
  miAgenda: () => [...agendaKeys.all, "mi-agenda"] as const,
  lista: () => [...agendaKeys.all, "lista"] as const,
  detalle: (id: number) => [...agendaKeys.all, id] as const,
  asignaciones: (id: number) => [...agendaKeys.all, id, "asignaciones"] as const,
}
