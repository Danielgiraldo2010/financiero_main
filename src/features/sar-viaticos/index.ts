// FE8 — SAR y Viáticos
export * from './model/types';
export * from './model/constants';
export * from './model/schema';
export * from './model/queryKeys';

export { useSar }        from './sar/listar/hook';
export { useSarDetalle } from './sar/detalle/hook';
export { useRegistrarSar }  from './sar/registrar/hook';
export { useAprobarSar }    from './sar/acciones/hook';
export { useAnularSar }     from './sar/acciones/hook';
export { useGenerarCdpSar } from './sar/acciones/hook';
export { useEjecutarSar }   from './sar/acciones/hook';
export { SarPage }       from './sar/listar/ui/SarPage';
export { SarDetailPage } from './sar/detalle/ui/SarDetailPage';

export { useTarifasViaticos }        from './tarifas-viaticos/listar/hook';
export { useCalcularViatico }        from './tarifas-viaticos/calcular/hook';
export { useRegistrarTarifaViatico } from './tarifas-viaticos/registrar/hook';
export { CalculadoraViaticos }       from './tarifas-viaticos/calcular/ui/CalculadoraViaticos';
export { RegistrarTarifaDialog }     from './tarifas-viaticos/registrar/ui/RegistrarTarifaDialog';

export { useViaticos }       from './viaticos/listar/hook';
export { useViaticoDetalle } from './viaticos/detalle/hook';
export { useRegistrarViatico }   from './viaticos/registrar/hook';
export { useAprobarViatico }     from './viaticos/acciones/hook';
export { useAnularViatico }      from './viaticos/acciones/hook';
export { useGenerarCdpViatico }  from './viaticos/acciones/hook';
export { useLiquidarViatico }    from './viaticos/acciones/hook';
export { ViaticosPage }      from './viaticos/listar/ui/ViaticosPage';
export { ViaticoDetailPage } from './viaticos/detalle/ui/ViaticoDetailPage';

export { useResumenSarViaticos }   from './resumen/hook';
export { ResumenSarViaticosPanel } from './resumen/ui/ResumenSarViaticosPanel';
