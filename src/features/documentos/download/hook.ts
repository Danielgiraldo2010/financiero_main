import { toast } from "sonner";
import { descargarDocumento } from "./api";

/**
 * Hook sin useMutation — la descarga es una acción imperativa, no reactiva.
 * Crea una URL temporal de objeto y la revoca después de la descarga.
 */
export function useDescargarDocumento() {
  const descargar = async (id: number, nombreSugerido?: string) => {
    try {
      const blob = await descargarDocumento(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = nombreSugerido ?? `documento-${id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revocar después de un frame para asegurar la descarga
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch {
      toast.error("Error al descargar el documento");
    }
  };

  return { descargar };
}
