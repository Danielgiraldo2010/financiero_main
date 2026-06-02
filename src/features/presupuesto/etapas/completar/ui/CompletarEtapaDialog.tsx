// features/presupuesto/etapas/completar/ui/CompletarEtapaDialog.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompletarEtapaSchema, type CompletarEtapaInput } from '../../../model/schema';
import { useCompletarEtapa } from '../hook';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/primitives/dialog';
import { FormField } from '@/shared/ui/forms/FormField';
import { Button } from '@/shared/ui/primitives/button';
import { Input } from '@/shared/ui/primitives/input';
import { Textarea } from '@/shared/ui/primitives/textarea';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  etapaId: number;
  etapaNombre: string;
}

export function CompletarEtapaDialog({
  open,
  onOpenChange,
  etapaId,
  etapaNombre,
}: Props) {
  const mutation = useCompletarEtapa();

  const form = useForm<CompletarEtapaInput>({
    resolver: zodResolver(CompletarEtapaSchema),
    defaultValues: { observaciones: null, urlActa: null },
  });

  function onSubmit(values: CompletarEtapaInput) {
    mutation.mutate(
      {
        id: etapaId,
        observaciones: values.observaciones ?? null,
        urlActa: values.urlActa ?? null,
      },
      {
        onSuccess: () => {
          form.reset();
          onOpenChange(false);
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Completar etapa: {etapaNombre}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="URL del Acta (opcional)"
            error={form.formState.errors.urlActa?.message}
          >
            <Input
              type="url"
              placeholder="https://..."
              {...form.register('urlActa')}
            />
          </FormField>

          <FormField
            label="Observaciones (opcional)"
            error={form.formState.errors.observaciones?.message}
          >
            <Textarea rows={4} {...form.register('observaciones')} />
          </FormField>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Completando…' : 'Completar etapa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
