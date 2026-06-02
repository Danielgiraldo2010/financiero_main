// Fixes aplicados:
// 1. roles: useAuthStore devuelve roles: string[], no user.rol
//    → const roles = useAuthStore((s) => s.roles)
//    → puedeAprobar: roles.includes('DECANO')
// 2. Estados sincronizados con valores reales:
//    PENDIENTE → puede aprobar (DECANO)
//    APROBADA_DECANO → puede refrendar (ADMIN_CENTRAL)
//    PENDIENTE | APROBADA_DECANO → puede rechazar
// FE5-I2: Aprobar → DECANO | Refrendar → ADMIN_CENTRAL
// FE5-I3: Rechazar → motivoRechazo obligatorio
// FE5-I4: Aviso explícito — saldo cambia SOLO al refrendar (APROBADA_PLANEACION)
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle2, XCircle, ShieldCheck, Info } from 'lucide-react'
import { Badge }    from '@/components/ui/badge'
import { Button }   from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label }    from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuthStore } from '@/shared/state/auth.store'
import { useAprobar, useRefrendar, useRechazar } from '../../acciones/hook'
import {
  AprobarModificacionSchema,
  RefrendarModificacionSchema,
  RechazarModificacionSchema,
  type AprobarModificacionInput,
  type RefrendarModificacionInput,
  type RechazarModificacionInput,
} from '../../model/schema'
import {
  ESTADO_MODIFICACION_LABELS,
  ESTADO_MODIFICACION_VARIANTS,
  ESTADO_MODIFICACION_TOOLTIP,
} from '../../model/constants'
import type { SolicitudModificacion } from '../../model/types'

type AccionActiva = 'aprobar' | 'refrendar' | 'rechazar' | null

interface Props {
  modificacion: SolicitudModificacion
}

export function AprobacionesModificacionPanel({ modificacion }: Props) {
  // Fix: roles vive en s.roles (string[]), no en s.user.rol
  const roles = useAuthStore((s) => s.roles)
  const [accion, setAccion] = useState<AccionActiva>(null)

  const aprobar   = useAprobar(modificacion.id)
  const refrendar = useRefrendar(modificacion.id)
  const rechazar  = useRechazar(modificacion.id)

  const formAprobar = useForm<AprobarModificacionInput>({
    resolver: zodResolver(AprobarModificacionSchema),
  })
  const formRefrendar = useForm<RefrendarModificacionInput>({
    resolver: zodResolver(RefrendarModificacionSchema),
  })
  const formRechazar = useForm<RechazarModificacionInput>({
    resolver: zodResolver(RechazarModificacionSchema),
  })

  // FE5-I2: estados reales del backend
  const puedeAprobar   = modificacion.estado === 'PENDIENTE'
    && roles.includes('DECANO')
  const puedeRefrendar = modificacion.estado === 'APROBADA_DECANO'
    && roles.includes('ADMIN_CENTRAL')
  const puedeRechazar  = ['PENDIENTE', 'APROBADA_DECANO'].includes(modificacion.estado)
    && (roles.includes('DECANO') || roles.includes('ADMIN_CENTRAL'))

  function cerrar() {
    setAccion(null)
    formAprobar.reset()
    formRefrendar.reset()
    formRechazar.reset()
  }

  return (
    <div className="space-y-4">
      {/* Estado actual con tooltip */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Estado actual:</span>
        <Badge
          variant={ESTADO_MODIFICACION_VARIANTS[modificacion.estado]}
          title={ESTADO_MODIFICACION_TOOLTIP[modificacion.estado]}
        >
          {ESTADO_MODIFICACION_LABELS[modificacion.estado]}
        </Badge>
      </div>

      {/* Siguiente acción */}
      <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm">
        <Info className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <span className="text-muted-foreground">{modificacion.siguienteAccion}</span>
      </div>

      {/* FE5-I4: aviso — saldo cambia SOLO al refrendar */}
      {modificacion.estado === 'APROBADA_DECANO' && (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <Info className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            El presupuesto <strong>aún no ha sido modificado</strong>. El saldo de los
            rubros se actualizará únicamente al <strong>Refrendar</strong> la solicitud
            (2ª firma — Admin Central / Planeación).
          </span>
        </div>
      )}

      {/* Botones de acción */}
      {(puedeAprobar || puedeRefrendar || puedeRechazar) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {puedeAprobar && (
            <Button onClick={() => setAccion('aprobar')}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Aprobar (1ª firma — Decano)
            </Button>
          )}
          {puedeRefrendar && (
            <Button
              className="bg-green-700 hover:bg-green-800"
              onClick={() => setAccion('refrendar')}
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Refrendar (2ª firma — Planeación)
            </Button>
          )}
          {puedeRechazar && (
            <Button variant="destructive" onClick={() => setAccion('rechazar')}>
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
          )}
        </div>
      )}

      {/* Sin acciones disponibles para el rol actual */}
      {!puedeAprobar && !puedeRefrendar && !puedeRechazar && (
        <p className="text-sm text-muted-foreground">
          No hay acciones disponibles para su rol en este estado.
        </p>
      )}

      {/* Historial */}
      {modificacion.usuarioAprueba && (
        <div className="text-sm text-muted-foreground space-y-1 border-t pt-3">
          <p><span className="font-medium">Aprobado por:</span> {modificacion.usuarioAprueba}</p>
          {modificacion.fechaAprobacion && (
            <p><span className="font-medium">Fecha:</span> {modificacion.fechaAprobacion}</p>
          )}
          {modificacion.observaciones && (
            <p><span className="font-medium">Observaciones:</span> {modificacion.observaciones}</p>
          )}
        </div>
      )}

      {/* ---- Dialog Aprobar ---- */}
      <AlertDialog open={accion === 'aprobar'} onOpenChange={(v) => { if (!v) cerrar() }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aprobar modificación</AlertDialogTitle>
            <AlertDialogDescription>
              1ª firma (Decano). Estado pasará a{' '}
              <strong>Aprobada — Decano</strong>. El presupuesto aún no se
              modifica; requiere refrendo posterior de Planeación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={formAprobar.handleSubmit((v) =>
              aprobar.mutate(v, { onSuccess: cerrar }),
            )}
            className="space-y-3"
          >
            <div className="space-y-1">
              <Label htmlFor="obs-aprobar">Observaciones</Label>
              <Textarea
                id="obs-aprobar"
                rows={3}
                {...formAprobar.register('observaciones')}
              />
              {formAprobar.formState.errors.observaciones && (
                <p className="text-xs text-destructive">
                  {formAprobar.formState.errors.observaciones.message}
                </p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cerrar}>Cancelar</AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={aprobar.isPending}>
                {aprobar.isPending ? 'Aprobando...' : 'Confirmar aprobación'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- Dialog Refrendar ---- */}
      <AlertDialog open={accion === 'refrendar'} onOpenChange={(v) => { if (!v) cerrar() }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Refrendar modificación</AlertDialogTitle>
            <AlertDialogDescription>
              2ª firma (Admin Central / Planeación). Estado pasará a{' '}
              <strong>Aprobada — Planeación</strong>.{' '}
              <strong>El saldo de los rubros se actualizará de forma inmediata e irreversible.</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={formRefrendar.handleSubmit((v) =>
              refrendar.mutate(v, { onSuccess: cerrar }),
            )}
            className="space-y-3"
          >
            <div className="space-y-1">
              <Label htmlFor="obs-refrendar">Observaciones</Label>
              <Textarea
                id="obs-refrendar"
                rows={3}
                {...formRefrendar.register('observaciones')}
              />
              {formRefrendar.formState.errors.observaciones && (
                <p className="text-xs text-destructive">
                  {formRefrendar.formState.errors.observaciones.message}
                </p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cerrar}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={refrendar.isPending}
                className="bg-green-700 hover:bg-green-800"
              >
                {refrendar.isPending ? 'Refrendando...' : 'Confirmar refrendo'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      {/* ---- Dialog Rechazar (FE5-I3) ---- */}
      <AlertDialog open={accion === 'rechazar'} onOpenChange={(v) => { if (!v) cerrar() }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rechazar modificación</AlertDialogTitle>
            <AlertDialogDescription>
              Indique el motivo del rechazo. Esta acción es irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={formRechazar.handleSubmit((v) =>
              rechazar.mutate(v, { onSuccess: cerrar }),
            )}
            className="space-y-3"
          >
            <div className="space-y-1">
              <Label htmlFor="motivo">
                Motivo del rechazo <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="motivo"
                rows={4}
                placeholder="Explique detalladamente el motivo del rechazo..."
                {...formRechazar.register('motivoRechazo')}
              />
              {formRechazar.formState.errors.motivoRechazo && (
                <p className="text-xs text-destructive">
                  {formRechazar.formState.errors.motivoRechazo.message}
                </p>
              )}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cerrar}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={rechazar.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {rechazar.isPending ? 'Rechazando...' : 'Confirmar rechazo'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
