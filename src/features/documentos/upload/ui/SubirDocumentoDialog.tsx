import { useState } from "react";
import { Dialog } from "@/shared/ui/modal/Dialog";
import SubirDocumentoForm from "./SubirDocumentoForm";
import { useSubirDocumento } from "../hook";
import { ApiError } from "@/shared/api/errors/ApiError";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SubirDocumentoDialog({ open, onClose }: Props) {
  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useSubirDocumento(() => {
    setServerError(null);
    onClose();
  });

  const handleSubmit = async (values: Parameters<typeof mutation.mutateAsync>[0]) => {
    setServerError(null);
    try {
      await mutation.mutateAsync(values);
    } catch (err: unknown) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Error inesperado al subir el documento";
      setServerError(message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setServerError(null);
        onClose();
      }}
      title="Subir documento"
      description="Sube un archivo al sistema de gestión documental."
    >
      <SubirDocumentoForm
        onSubmit={handleSubmit}
        isPending={mutation.isPending}
        onCancel={() => {
          setServerError(null);
          onClose();
        }}
        serverError={serverError}
      />
    </Dialog>
  );
}