import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import tangoLogo from "@/assets/tango-logo.png";
import { Button } from "@/components/ui/button";

export function LegalPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar with back button */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-primary/40 hover:bg-primary/10"
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Grįžti
            </Link>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <img
              src={tangoLogo}
              alt="Tango Pizza & Grill"
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="hidden font-display text-sm tracking-wider sm:inline">
              TANGO PIZZA & GRILL
            </span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
            Tango Pizza & Grill
          </p>
          <h1 className="font-display text-4xl tracking-wider md:text-5xl">{title}</h1>
          <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
          {subtitle && (
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card/40 p-6 backdrop-blur-sm md:p-10 [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:tracking-wider [&_h2]:text-primary [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:tracking-wider [&_h3]:text-foreground [&_p]:mb-4 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-sm [&_ul]:text-muted-foreground [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:text-sm [&_ol]:text-muted-foreground [&_strong]:text-foreground [&_a]:text-primary [&_a]:underline-offset-2 hover:[&_a]:underline">
          {children}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Grįžti į pradžią
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
