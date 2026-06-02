import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { FormField } from "@/shared/ui/forms/FormField";
import { Button } from "@/shared/ui/primitives/button";
import { Input } from "@/shared/ui/primitives/input";
import {
  TIPOS_DOCUMENTO,
  EXTENSIONES_PERMITIDAS,
  formatBytes,
} from "../../shared/constants";
import { subirDocumentoSchema, type SubirDocumentoValues } from "../schema";

interface Props {
  onSubmit: (values: SubirDocumentoValues) => void;
  isPending: boolean;
  onCancel?: () => void;
  serverError?: string | null;
}

export default function SubirDocumentoForm({
  onSubmit,
  isPending,
  onCancel,
  serverError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ name: string; size: number } | null>(null);
  const currentYear = new Date().getFullYear();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SubirDocumentoValues>({
    resolver: zodResolver(subirDocumentoSchema),
    defaultValues: {
      esPublico: false,
      vigencia: currentYear,
    },
  });

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setPreview({ name: file.name, size: file.size });
    setValue("archivo", file, { shouldValidate: true });
    const sinExt = file.name.replace(/\.[^/.]+$/, "");
    setValue("nombre", sinExt, { shouldValidate: false });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const submit: SubmitHandler<SubirDocumentoValues> = (values) => onSubmit(values);

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Error del servidor — banner inline */}
      {serverError && (
        <div className="flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={EXTENSIONES_PERMITIDAS}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {preview ? (
          <div className="flex items-center justify-center gap-3 text-sm">
            <FileText className="size-5 text-primary" />
            <span className="font-medium">{preview.name}</span>
            <span className="text-[#5a6c82]">{formatBytes(preview.size)}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPreview(null);
                setValue("archivo", undefined as unknown as File);
              }}
            >
              <X className="size-4 text-neutral-400 hover:text-destructive" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#5a6c82]">
            <Upload className="size-8" />
            <p className="text-sm">
              Arrastra un archivo o{" "}
              <span className="text-primary font-medium">haz clic aquí</span>
            </p>
            <p className="text-xs">PDF, DOCX, XLSX, PNG, JPG — máx. 10 MB</p>
          </div>
        )}
      </div>
      {errors.archivo && (
        <p className="text-sm text-destructive">{errors.archivo.message}</p>
      )}

      {/* Nombre */}
      <FormField
        label="Nombre del documento"
        {...(errors.nombre?.message ? { error: errors.nombre.message } : {})}
      >
        <Input
          {...register("nombre")}
          placeholder="Ej. Contrato de servicios 2025"
        />
      </FormField>

      {/* Tipo */}
      <FormField
        label="Tipo de documento"
        {...(errors.tipoDocumento?.message ? { error: errors.tipoDocumento.message } : {})}
      >
        <select
          {...register("tipoDocumento")}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Selecciona un tipo…</option>
          {TIPOS_DOCUMENTO.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </FormField>

      {/* Descripción */}
      <FormField
        label="Descripción"
        {...(errors.descripcion?.message ? { error: errors.descripcion.message } : {})}
      >
        <textarea
          {...register("descripcion")}
          rows={2}
          placeholder="Opcional"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
        />
      </FormField>

      {/* Vigencia + Es público */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Año de vigencia presupuestal"
          {...(errors.vigencia?.message ? { error: errors.vigencia.message } : {})}
        >
          <Input
            type="number"
            {...register("vigencia")}
            placeholder={`Ej. ${currentYear}`}
            min={1900}
            max={currentYear}
          />
        </FormField>

        <FormField label="Visibilidad">
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-2">
            <input
              type="checkbox"
              {...register("esPublico")}
              className="rounded"
            />
            Documento público
          </label>
        </FormField>
      </div>

      {/* Acciones */}
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Subiendo…" : "Subir documento"}
        </Button>
      </div>
    </form>
  );
}
