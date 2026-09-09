import { useEffect } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  CheckSquare,
  GraduationCap,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAcademicStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

const NAV = [
  { to: "/", label: "Inicio", icon: LayoutDashboard },
  { to: "/horario", label: "Horario", icon: CalendarDays },
  { to: "/tareas", label: "Tareas", icon: CheckSquare },
  { to: "/materias", label: "Materias", icon: BookOpen },
  { to: "/periodo", label: "Periodo", icon: GraduationCap },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const hydrated = useAcademicStore((s) => s.hydrated);

  const openNewCourse = () => {
    useAcademicStore.getState().setNewCourseOpen(true);
    void navigate({ to: "/materias" });
  };

  useEffect(() => {
    const unsub = useAcademicStore.persist.onFinishHydration(() => {
      useAcademicStore.getState().ensureSeed();
      useAcademicStore.getState().setHydrated(true);
    });
    void useAcademicStore.persist.rehydrate();
    if (useAcademicStore.persist.hasHydrated()) {
      useAcademicStore.getState().ensureSeed();
      useAcademicStore.getState().setHydrated(true);
    }
    return unsub;
  }, []);

  if (!hydrated) return <ShellSkeleton />;

  return (
    <div className="paper-grain min-h-dvh">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col bg-ink text-paper lg:flex">
        <Brand />
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map((item) => (
            <NavLink key={item.to} {...item} pathname={pathname} />
          ))}
        </nav>
        <div className="p-3 pb-5">
          <Button variant="paper" className="w-full justify-center" onClick={openNewCourse}>
            <Plus className="size-4" />
            Nueva materia
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-rule/80 bg-paper/85 px-4 py-3 backdrop-blur-md lg:hidden">
        <Brand compact />
        <Button size="icon-sm" variant="ink" onClick={openNewCourse} aria-label="Nueva materia">
          <Plus className="size-4" />
        </Button>
      </header>

      <main className="min-w-0 lg:pl-[232px]">
        <div className="mx-auto min-w-0 max-w-6xl px-4 py-6 pb-28 lg:px-8 lg:py-8 lg:pb-10">
          {children}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper/95 px-2 pt-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-[12px] text-[11px] font-medium",
                  active ? "text-ink" : "text-ink-faint",
                )}
              >
                <Icon className={cn("size-5", active && "stroke-[2.2]")} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <Toaster />
    </div>
  );
}

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", compact ? "" : "px-5 py-6")}>
      <span className="flex size-8 items-center justify-center rounded-[8px] bg-paper-2 text-ink shadow-card">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden>
          <rect x="5" y="4" width="14" height="16" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
          <path d="M5 4h3v16H5" fill="#2C4A5E" stroke="currentColor" strokeWidth="1.2" />
          <path d="M11 9h5M11 12h5M11 15h3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
      <span>
        <span className="font-display block text-lg leading-none text-paper lg:text-paper">
          <span className={compact ? "text-ink" : "text-paper"}>Aula</span>
        </span>
        {!compact ? (
          <span className="text-[11px] tracking-wide text-paper/55">Tu semestre, en orden</span>
        ) : null}
      </span>
    </Link>
  );
}

function NavLink({
  to,
  label,
  icon: Icon,
  pathname,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  pathname: string;
}) {
  const active = isActive(pathname, to);
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm transition-colors duration-150",
        active ? "bg-paper/12 text-paper" : "text-paper/60 hover:bg-paper/8 hover:text-paper",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

function ShellSkeleton() {
  return (
    <div className="paper-grain min-h-dvh">
      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 w-[232px] bg-ink" />
      </div>
      <div className="lg:pl-[232px]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="h-8 w-48 rounded-md bg-paper-3" />
          <div className="mt-3 h-4 w-72 rounded bg-paper-3/80" />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="h-64 rounded-[24px] bg-paper-2 shadow-card lg:col-span-2" />
            <div className="h-64 rounded-[24px] bg-paper-2 shadow-card" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {kicker ? (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
            {kicker}
          </p>
        ) : null}
        <h1 className="font-display text-[1.85rem] text-ink sm:text-[2.15rem]">{title}</h1>
        {description ? <p className="mt-1 max-w-xl text-sm text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[24px] bg-paper-2 p-4 shadow-card sm:p-5",
        className,
      )}
    >
      {children}
    </section>
  );
}
