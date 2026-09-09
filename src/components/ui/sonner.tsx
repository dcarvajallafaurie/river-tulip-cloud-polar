import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "bg-paper-2 text-ink shadow-[var(--shadow-border-hover)] border-0 rounded-[16px] font-[Figtree,sans-serif]",
          title: "text-ink font-medium",
          description: "text-ink-soft",
        },
      }}
    />
  );
}
