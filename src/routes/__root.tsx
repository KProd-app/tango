import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { CartProvider } from "@/lib/cart-context";
import { SuggestionsProvider } from "@/lib/suggestions-context";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n/context";
import { CartSheet } from "@/components/CartSheet";
import { SplashScreen } from "@/components/SplashScreen";
import { CookieBanner } from "@/components/CookieBanner";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Puslapis nerastas</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ieškomas puslapis neegzistuoja arba buvo perkeltas.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Grįžti į pradžią
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tango Pizza & Grill" },
      { name: "description", content: "Tango Pizza & Grill — neapolietiškos picos, suši, poke bowl ir grilio patiekalai. Užsisakykite internetu." },
      { property: "og:title", content: "Tango Pizza & Grill" },
      { property: "og:description", content: "Neapolietiškos picos, suši, poke bowl ir grilio patiekalai. Užsisakykite internetu." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Tango Pizza & Grill" },
      { property: "og:locale", content: "lt_LT" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tango Pizza & Grill" },
      { name: "twitter:description", content: "Neapolietiškos picos, suši, poke bowl ir grilio patiekalai. Užsisakykite internetu." },
      { property: "og:url", content: "https://tango.kprod.app/" },
      { property: "og:image", content: "https://tango.kprod.app/og-image.jpg" },
      { name: "twitter:image", content: "https://tango.kprod.app/og-image.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Pacifico&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="lt">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <SuggestionsProvider>
            
            <Outlet />
            <CartSheet />
            <CookieBanner />
            <ScrollToTop />
            <Toaster position="top-right" theme="dark" richColors />
          </SuggestionsProvider>
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
