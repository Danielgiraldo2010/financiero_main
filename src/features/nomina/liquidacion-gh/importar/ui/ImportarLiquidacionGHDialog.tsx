import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog } from '@/shared/ui/modal/Dialog'
import { FormField } from '@/shared/ui/forms/FormField'
import { formatCOP } from '@/shared/lib/currency'
import {
  importarLiquidacionGH,
  type LineaLiquidacionGH,
  type ImportacionResult,
} from '../api'

// Columnas esperadas en el CSV/XLSX (en este orden)
const CSV_COLUMNS: (keyof LineaLiquidacionGH)[] = [
  'empleadoId', 'tipoNomina', 'horasLiquidadas', 'valorHora',
  'valorBase', 'valorSalud', 'valorPension', 'valorArl',
  'valorParafiscales', 'valorPrestaciones',
]

const MIME_PERMITIDOS = [
  'text/csv',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
]

function parseCsvText(text: string): LineaLiquidacionGH[] {
  const lines = text.trim().split('\n').filter(Boolean)
  // Saltar encabezado si la primera fila contiene texto no numérico
  const start = isNaN(Number(lines[0]?.split(',')[0])) ? 1 : 0
  return lines.slice(start).map((line) => {
    const cols = line.split(',').map((c) => c.trim().replace(/"/g, ''))
    const obj: Record<string, number | string> = {}
    CSV_COLUMNS.forEach((col, i) => {
      obj[col] = col === 'tipoNomina' ? (cols[i] ?? '') : Number(cols[i] ?? 0)
    })
    return obj as unknown as LineaLiquidacionGH
  })
}

interface Props {
  vigencia:   number
  mes:        number
  proyectoId: number
  open:       boolean
  onClose:    () => void
}

export function ImportarLiquidacionGHDialog({
  vigencia, mes, proyectoId, open, onClose,
}: Props) {
  const qc = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)

  const [lineas, setLineas]         = useState<LineaLiquidacionGH[]>([])
  const [fileName, setFileName]     = useState('')
  const [parseError, setParseError] = useState('')
  const [result, setResult]         = useState<ImportacionResult | null>(null)

  const mutation = useMutation({
    mutationFn: importarLiquidacionGH,
    onSuccess: (res) => {
      setResult(res)
      qc.invalidateQueries({ queryKey: ['nomina', 'liquidacion-gh'] })
    },
  })

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setParseError('')
    setLineas([])
    setResult(null)

    // 07c-I1: validar MIME
    if (!MIME_PERMITIDOS.includes(file.type) && !file.name.endsWith('.csv')) {
      setParseError('Solo se aceptan archivos CSV o XLSX.')
      return
    }

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string
        const parsed = parseCsvText(text)
        if (parsed.length === 0) {
          setParseError('El archivo no contiene filas de datos.')
          return
        }
        setLineas(parsed)
      } catch {
        setParseError('Error al parsear el archivo. Verifica el formato.')
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  const handleImportar = async () => {
    if (lineas.length === 0) return
    await mutation.mutateAsync({
      vigencia,
      mes,
      proyectoId,
      origenArchivo: fileName,
      lineas,
    })
  }

  const handleClose = () => {
    setLineas([])
    setFileName('')
    setParseError('')
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  const preview = lineas.slice(0, 5)

  return (
    <Dialog open={open} onClose={handleClose} title="Importar Liquidación GH">
      <div className="space-y-4">

        <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-sm text-blue-700">
          Período: <strong>{mes}/{vigencia}</strong> · Proyecto ID:{' '}
          <strong>{proyectoId}</strong>
        </div>

        {/* Selector de archivo */}
        <FormField
          label="Archivo CSV o XLSX"
          error={parseError}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="input"
            onChange={handleFile}
            disabled={mutation.isPending}
          />
        </FormField>

        {/* Preview — 5 primeras filas (07c-I1) */}
        {preview.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Vista previa ({lineas.length} filas detectadas, mostrando {preview.length})
            </p>
            <div className="overflow-x-auto">
              <table className="table w-full text-xs">
                <thead>
                  <tr>
                    <th>Empleado ID</th>
                    <th>Tipo</th>
                    <th>Horas Liq.</th>
                    <th>Valor Hora</th>
                    <th>Valor Base</th>
                    <th>Salud</th>
                    <th>Pensión</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((l, i) => (
                    <tr key={i}>
                      <td>{l.empleadoId}</td>
                      <td>{l.tipoNomina}</td>
                      <td>{l.horasLiquidadas}</td>
                      <td>{formatCOP(l.valorHora)}</td>
                      <td>{formatCOP(l.valorBase)}</td>
                      <td>{formatCOP(l.valorSalud)}</td>
                      <td>{formatCOP(l.valorPension)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resultado de importación */}
        {result && (
          <div className={`rounded-md p-3 text-sm ${
            result.lineasError === 0
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-amber-50 border border-amber-200 text-amber-800'
          }`}>
            <p className="font-medium">{result.mensaje}</p>
            <p className="text-xs mt-1">
              Importadas: {result.lineasImportadas} · Errores: {result.lineasError}
            </p>
          </div>
        )}

        {mutation.error && (
          <p className="text-sm text-red-600">
            {(mutation.error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            className="btn-secondary"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            {result ? 'Cerrar' : 'Cancelar'}
          </button>
          {!result && (
            <button
              type="button"
              className="btn-primary"
              onClick={handleImportar}
              disabled={lineas.length === 0 || mutation.isPending}
            >
              {mutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Importando…
                </span>
              ) : (
                `Importar ${lineas.length} filas`
              )}
            </button>
          )}
        </div>
      </div>
    </Dialog>
  )
}
