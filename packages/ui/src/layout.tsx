import { cn } from "./lib/utils";

export function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("min-h-screen bg-neutral-100", className)}>
      {children}
    </div>
  );
}

export function LayoutHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur", className)}>
      {children}
    </header>
  );
}

export function LayoutContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <main className={cn("flex-1", className)}>
      {children}
    </main>
  );
}

export function LayoutFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <footer className={cn("border-t border-neutral-200 bg-white", className)}>
      {children}
    </footer>
  );
}

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}