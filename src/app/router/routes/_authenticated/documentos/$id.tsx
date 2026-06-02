import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner";

const DocumentoDetailPage = lazy(() =>
  import("@/features/documentos/detail/ui/DocumentoDetailPage").then((m) => ({
    default: m.DocumentoDetailPage,
  }))
);

function DocumentoDetail() {
  const { id } = Route.useParams();
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <DocumentoDetailPage documentoId={parseInt(id, 10)} />
    </Suspense>
  );
}

export const Route = createFileRoute("/_authenticated/documentos/$id")({
  component: DocumentoDetail,
});