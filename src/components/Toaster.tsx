import { Toaster as Sonner } from 'sonner@2.0.3';

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast: 'rounded-xl border-2 shadow-lg',
          title: 'font-semibold',
          description: 'text-sm',
          success: 'bg-green-50 border-green-200',
          error: 'bg-red-50 border-red-200',
          info: 'bg-blue-50 border-blue-200',
        },
      }}
    />
  );
}