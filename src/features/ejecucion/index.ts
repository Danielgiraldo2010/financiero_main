// features/ejecucion/index.ts
// Barrel completo del módulo FE9 (fe_09a + fe_09b + fe_09c)

// ── Modelo compartido (fe_09a) ──────────────────────────────────────────────
export * from './model/types';
export * from './model/constants';
export * from './model/queryKeys';

// ── CDP (fe_09a) ────────────────────────────────────────────────────────────
export * from './cdp/model/queryKeys';
export { useCdps }                    from './cdp/listar/hook';
export { useCdp }                     from './cdp/detalle/hook';
export { useGenerarCdp }              from './cdp/generar/hook';
export { useAnularCdp }               from './cdp/anular/hook';
export { useVerificarDisponibilidad } from './cdp/verificar/hook';
export { CdpPage }                    from './cdp/listar/ui/CdpPage';
export { CdpDetailPage }              from './cdp/detalle/ui/CdpDetailPage';
export { GenerarCdpDialog }           from './cdp/generar/ui/GenerarCdpDialog';
export { AnularCdpDialog }            from './cdp/anular/ui/AnularCdpDialog';

// ── Registro Presupuestal (fe_09a) ──────────────────────────────────────────
export * from './registro-presupuestal/model/queryKeys';
export { useRps }          from './registro-presupuestal/listar/hook';
export { useRp }           from './registro-presupuestal/detalle/hook';
export { useRpSaldo }      from './registro-presupuestal/saldo/hook';
export { useGenerarRp }    from './registro-presupuestal/generar/hook';
export { RpPage }          from './registro-presupuestal/listar/ui/RpPage';
export { RpDetailPage }    from './registro-presupuestal/detalle/ui/RpDetailPage';
export { GenerarRpDialog } from './registro-presupuestal/generar/ui/GenerarRpDialog';

// ── Orden de Pago (fe_09b) ──────────────────────────────────────────────────
export * from './orden-pago/model/queryKeys';
export { useOps }              from './orden-pago/listar/hook';
export { useRegistrarOp }      from './orden-pago/registrar/hook';
export { useConfirmarPagoOp }  from './orden-pago/confirmar/hook';
export { OpPage }              from './orden-pago/listar/ui/OpPage';
export { RegistrarOpDialog }   from './orden-pago/registrar/ui/RegistrarOpDialog';
export { ConfirmarPagoDialog } from './orden-pago/confirmar/ui/ConfirmarPagoDialog';

// ── Reservas (fe_09b) ───────────────────────────────────────────────────────
export * from './reservas/model/queryKeys';
export { useReservas }            from './reservas/listar/hook';
export { useRegistrarReserva }    from './reservas/registrar/hook';
export { useEjecutarReserva, useAnularReserva } from './reservas/acciones/hook';
export { ReservasPage }           from './reservas/listar/ui/ReservasPage';
export { RegistrarReservaDialog } from './reservas/registrar/ui/RegistrarReservaDialog';

// ── Radicación (fe_09b) ─────────────────────────────────────────────────────
export * from './radicacion/model/queryKeys';
export { useRadicaciones }           from './radicacion/listar/hook';
export { useRegistrarRadicacion }    from './radicacion/registrar/hook';
export { useAprobarRadicacion, useRechazarRadicacion } from './radicacion/acciones/hook';
export { RadicacionPage }            from './radicacion/listar/ui/RadicacionPage';
export { RegistrarRadicacionDialog } from './radicacion/registrar/ui/RegistrarRadicacionDialog';

// ── Avances (fe_09b) ────────────────────────────────────────────────────────
export * from './avances/model/queryKeys';
export { useAvances }            from './avances/listar/hook';
export { useRegistrarAvance }    from './avances/registrar/hook';
export { useLegalizarAvance }    from './avances/legalizar/hook';
export { AvancesPage }           from './avances/listar/ui/AvancesPage';
export { RegistrarAvanceDialog } from './avances/registrar/ui/RegistrarAvanceDialog';
export { LegalizarAvanceDialog } from './avances/legalizar/ui/LegalizarAvanceDialog';

// ── Reportes (fe_09c) ───────────────────────────────────────────────────────
export * from './reportes/model/types';
export { useSeguimientoCdp }      from './reportes/seguimiento-cdp/hook';
export { useEjecucionPorRubro }   from './reportes/por-rubro/hook';
export { useGenerarAlertas }      from './reportes/generar-alertas/hook';
export { SeguimientoCdpPage }     from './reportes/seguimiento-cdp/ui/SeguimientoCdpPage';
export { EjecucionPorRubroPage }  from './reportes/por-rubro/ui/EjecucionPorRubroPage';
export { EjecucionBarChart }      from './reportes/por-rubro/ui/EjecucionBarChart';
export { GenerarAlertasPage }     from './reportes/generar-alertas/ui/GenerarAlertasPage';
