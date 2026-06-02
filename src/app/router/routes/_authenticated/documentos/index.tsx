import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/shared/ui/feedback/LoadingSpinner";

const DocumentosPage = lazy(() =>
  import("@/features/documentos/search/ui/DocumentosPage").then((m) => ({
    default: m.DocumentosPage,
  }))
);

export const Route = createFileRoute("/_authenticated/documentos/")({
  component: () => (
    <Suspense fallback={<div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>}>
      <DocumentosPage />
    </Suspense>
  ),
});