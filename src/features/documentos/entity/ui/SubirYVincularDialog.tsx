import { useState } from "react";
import { Dialog } from "@/shared/ui/modal/Dialog";
import SubirDocumentoForm from "../../upload/ui/SubirDocumentoForm";
import { useSubirDocumento } from "../../upload/hook";
import { useVincularDocumento } from "../../link/hook";
import { useAuthStore } from "@/shared/state/auth.store";
import type { TipoEntidadDocumento } from "../../model/types";
import type { SubirDocumentoValues } from "../../upload/schema";

interface Props {
  open: boolean;
  onClose: () => void;
  entidadTipo: TipoEntidadDocumento;
  entidadId: number;
}

/**
 * Sube el documento y lo vincula automáticamente a la entidad en dos pasos.
 */
export default function SubirYVincularDialog({
  open,
  onClose,
  entidadTipo,
  entidadId,
}: Props) {
  const user = useAuthStore((s) => s.user);
  const [isPending, setIsPending] = useState(false);

  const subir = useSubirDocumento();
  const vincular = useVincularDocumento(entidadTipo, entidadId);

  const handleSubmit = async (values: SubirDocumentoValues) => {
    setIsPending(true);
    try {
      const doc = await subir.mutateAsync(values);
      await vincular.mutateAsync({
        documentoId: doc.id,
        request: {
          entidadTipo,
          entidadId,
          esPrincipal: false,
          creadoPor: user?.email ?? "sistema",
        },
      });
      onClose();
    } catch {
      // errores ya manejados por cada hook via toast
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Subir y vincular documento"
      description={`El documento se vinculará automáticamente a ${entidadTipo} #${entidadId}.`}
    >
      <SubirDocumentoForm
        onSubmit={handleSubmit}
        isPending={isPending}
        onCancel={onClose}
      />
    </Dialog>
  );
}
