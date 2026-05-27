import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ShoppingCart, ChefHat, Loader2, Star, ChevronDown, ChevronLeft, ChevronRight, Navigation, Facebook, Instagram, Menu, X, Building2, Heart, LayoutGrid, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import steamingPizza from "@/assets/steaming-pizza-transparent.png";
import tangoLogo from "@/assets/tango-logo.png";
import { MenuItemCard } from "@/components/MenuItemCard";
import { useCart } from "@/lib/cart-context";
import { useMenu } from "@/hooks/use-menu";
import { useFavorites } from "@/hooks/use-favorites";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n/context";
import { pickTranslation } from "@/lib/menu-types";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PromoBanner } from "@/components/PromoBanner";
import { AnimatedReviewStats } from "@/components/AnimatedReviewStats";
import { getCategoryIcon } from "@/lib/category-icons";
import { motion, LayoutGroup } from "framer-motion";



const RESTAURANT_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Tango Pizza & Grill",
  image: "https://tangopizzagrill.lt/og-image.jpg",
  "@id": "https://tangopizzagrill.lt",
  url: "https://tangopizzagrill.lt",
  telephone: "+370 646 42288",
  priceRange: "€€",
  servesCuisine: ["Italian", "Pizza", "Grill", "Sushi", "Asian"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Vytauto g. 11A",
    addressLocality: "Prienai",
    postalCode: "59124",
    addressCountry: "LT",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 54.6379,
    longitude: 23.9436,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"], opens: "11:00", closes: "22:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Friday", "Saturday"], opens: "11:00", closes: "00:00" },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    reviewCount: "3400",
  },
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Tango Pizza & Grill — Neapolietiškos picos ir suši" },
      {
        name: "description",
        content:
          "Tango Pizza & Grill — autentiškos neapolietiškos picos krosnyje, suši, poke bowl ir grilio patiekalai. Atvira nuo 2009 m.",
      },
      { property: "og:title", content: "Tango Pizza & Grill — Neapolietiškos picos ir suši" },
      {
        property: "og:description",
        content: "Neapolietiškos picos, suši, poke bowl ir grilio patiekalai Prienuose. Atvira nuo 2009 m.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(RESTAURANT_JSON_LD),
      },
    ],
  }),
});

const workingHoursDef = [
  { key: "mon" as const, hours: "11:00 – 22:00", open: 11, close: 22 },
  { key: "tue" as const, hours: "11:00 – 22:00", open: 11, close: 22 },
  { key: "wed" as const, hours: "11:00 – 22:00", open: 11, close: 22 },
  { key: "thu" as const, hours: "11:00 – 22:00", open: 11, close: 22 },
  { key: "fri" as const, hours: "11:00 – 00:00", open: 11, close: 24 },
  { key: "sat" as const, hours: "11:00 – 00:00", open: 11, close: 24 },
  { key: "sun" as const, hours: "11:00 – 22:00", open: 11, close: 22 },
];

const dayMap = [6, 0, 1, 2, 3, 4, 5];

function getOpenStatus(now: Date) {
  const today = workingHoursDef[dayMap[now.getDay()]];
  const hour = now.getHours() + now.getMinutes() / 60;
  const isOpen = hour >= today.open && hour < today.close;
  return { isOpen, today };
}

function Index() {
  const [now, setNow] = useState<Date | null>(null);
  const { categories, loading } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [allCategoriesView, setAllCategoriesView] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const MOBILE_LIMIT = 8;
  const { isFavorite, count: favCount } = useFavorites();
  const categoryScrollerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollCategories = (dir: "left" | "right") => {
    const el = categoryScrollerRef.current;
    if (!el) return;
    // Snap by exactly one card width (using first child width + gap)
    const firstChild = el.firstElementChild as HTMLElement | null;
    const styles = window.getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || "8") || 8;
    const step = firstChild ? firstChild.getBoundingClientRect().width + gap : 200;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };
  const updateScrollState = () => {
    const el = categoryScrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    const el = categoryScrollerRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [categories, allCategoriesView, favoritesOnly]);
  const { setOpen: setCartOpen, totalQuantity } = useCart();
  const { isAdmin } = useAuth();
  const { t, lang } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locating, setLocating] = useState(false);

  const DESTINATION =
    "Tango+Pizza+%26+Grill%2C+Vytauto+g.+11A%2C+Prienai+59124";
  const DESTINATION_PLACE_ID = "ChIJrc4P4M0r3UYRY5VnXkUhMPg";

  const openDirections = (origin?: string) => {
    const base = "https://www.google.com/maps/dir/?api=1";
    const originParam = origin ? `&origin=${encodeURIComponent(origin)}` : "";
    const url = `${base}${originParam}&destination=${DESTINATION}&destination_place_id=${DESTINATION_PLACE_ID}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNavigateClick = () => {
    if (!("geolocation" in navigator)) {
      toast.info(t.contact.geoUnsupported);
      openDirections();
      return;
    }
    setLocating(true);
    const timeoutId = setTimeout(() => {
      setLocating(false);
    }, 12000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeoutId);
        setLocating(false);
        const origin = `${pos.coords.latitude},${pos.coords.longitude}`;
        openDirections(origin);
      },
      (err) => {
        clearTimeout(timeoutId);
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.info(t.contact.geoDenied);
        } else {
          toast.error(t.contact.geoError);
        }
        openDirections();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };


  useEffect(() => {
    setNow(new Date());
    const tm = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tm);
  }, []);

  // Auto-select first category (Picas) once menu loads
  useEffect(() => {
    if (!loading && categories.length > 0 && activeCategory === null && !allCategoriesView) {
      setActiveCategory(categories[0].slug);
    }
  }, [loading, categories, activeCategory, allCategoriesView]);

  const status = now ? getOpenStatus(now) : null;
  const todayIndex = now ? dayMap[now.getDay()] : -1;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PromoBanner />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <a href="#" className="flex items-center">
              <img src={tangoLogo} alt="Tango Pizza & Grill" width={48} height={48} className="h-10 w-10 object-contain sm:h-12 sm:w-12" />
            </a>
            <a
              href="https://maps.google.com/?q=Vytauto+g.+11A,+Prienai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-[0_4px_14px_oklch(0.55_0.22_27/0.4)] transition-all hover:bg-primary/90 hover:shadow-[0_6px_20px_oklch(0.55_0.22_27/0.5)] sm:px-3 sm:py-1.5 sm:text-xs"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="whitespace-nowrap">Vytauto g. 11A, Prienai</span>
            </a>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
            <a href="#meniu" className="pointer-events-auto text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
              {t.nav.menu}
            </a>
            <a href="#apie" className="pointer-events-auto text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
              {t.nav.about}
            </a>
            <a href="#rezervacija" className="pointer-events-auto text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
              {t.nav.reservation}
            </a>
            <a href="#kontaktai" className="pointer-events-auto text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary">
              {t.nav.contact}
            </a>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitcher />
            {isAdmin && (
              <Button asChild variant="outline" size="sm" className="border-primary/40">
                <Link to="/admin">
                  <ChefHat className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav.admin}</span>
                </Link>
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              aria-label={`${t.nav.cart}${totalQuantity > 0 ? ` (${totalQuantity})` : ""}`}
              className="relative bg-primary hover:bg-primary/90"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{t.nav.cart}</span>
              {totalQuantity > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[10px] font-bold text-accent-foreground">
                  {totalQuantity}
                </span>
              )}
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Meniu"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary md:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-border/40 bg-background/95 backdrop-blur-md md:hidden">
            <div className="flex flex-col px-4 py-2">
              <a
                href="#meniu"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-border/30 py-3 text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.menu}
              </a>
              <a
                href="#apie"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-border/30 py-3 text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.about}
              </a>
              <a
                href="#rezervacija"
                onClick={() => setMobileMenuOpen(false)}
                className="border-b border-border/30 py-3 text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.reservation}
              </a>
              <a
                href="#kontaktai"
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary"
              >
                {t.nav.contact}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden pt-24 pb-20 sm:pt-24 sm:pb-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--ember)_0%,_transparent_60%)] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[120px] sm:h-[600px] sm:w-[600px]" />

        <div className="pointer-events-none absolute left-1/2 top-[45%] z-0 -translate-x-1/2 -translate-y-1/2 sm:top-1/2">
          <div className="relative">
            <div className="absolute -top-32 left-1/4 h-40 w-16 animate-steam-1 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -top-40 left-1/2 h-48 w-20 animate-steam-2 rounded-full bg-white/15 blur-2xl" />
            <div className="absolute -top-36 right-1/4 h-44 w-16 animate-steam-3 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -top-28 left-[40%] h-36 w-12 animate-steam-2 rounded-full bg-white/8 blur-xl" />
            <div className="absolute -top-44 right-[35%] h-52 w-14 animate-steam-1 rounded-full bg-white/12 blur-2xl" />

            {/* Mobile-only red glow behind pizza — large & soft for smooth blend */}
            <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_oklch(0.6_0.24_30/0.45)_0%,_oklch(0.55_0.22_27/0.25)_35%,_transparent_75%)] blur-3xl sm:hidden" />

            <img
              src={steamingPizza}
              alt="Garuojanti neapolietiška pica"
              width={600}
              height={600}
              fetchPriority="high"
              decoding="async"
              className="relative h-[400px] w-[400px] max-w-[90vw] object-contain opacity-95 drop-shadow-[0_0_60px_oklch(0.6_0.24_30/0.6)] sm:h-[500px] sm:w-[500px] sm:max-w-none sm:[filter:drop-shadow(0_0_60px_rgba(255,100,50,0.4))] md:h-[600px] md:w-[600px]"
            />

            <div className="absolute inset-0 bg-gradient-radial from-primary/40 via-transparent to-transparent blur-3xl" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6">
          <div
            className={`mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-sm ${
              status?.isOpen
                ? "border-green-500/40 bg-green-500/10"
                : "border-primary/30 bg-primary/10"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  status?.isOpen ? "bg-green-500" : "bg-primary"
                }`}
              />
              <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                  status?.isOpen ? "bg-green-500" : "bg-primary"
                }`}
              />
            </span>
            <span
              className={`text-[11px] uppercase tracking-[0.2em] sm:text-xs ${
                status?.isOpen ? "text-green-400" : "text-primary"
              }`}
            >
              {status === null
                ? t.hero.badgeSince
                : status.isOpen
                  ? `${t.hero.badgeOpen} ${status.today.hours.split("–")[1].trim()}`
                  : `${t.hero.badgeClosed} · ${t.days[status.today.key]} ${status.today.hours}`}
            </span>
          </div>

          <h1 className="mb-2 mt-0 font-display text-7xl leading-[0.95] tracking-wider sm:mb-2 sm:text-8xl md:text-[10rem] lg:text-[14rem]">
            <span className="block bg-gradient-to-b from-white via-white to-primary/60 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
              TANGO
            </span>
            <span className="mt-2 block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)] sm:-mt-4 md:-mt-8">
              PIZZA
            </span>
            <span className="sr-only"> & Grill — Neapolietiškos picos, suši ir grilis Prienuose</span>
          </h1>

          <p className="-mt-4 mb-10 font-script text-2xl text-primary sm:-mt-6 sm:text-3xl md:-mt-6 md:text-4xl lg:-mt-8 lg:text-5xl">
            {t.hero.tagline}
          </p>

          <p className="mx-auto mb-12 mt-16 max-w-2xl px-2 text-sm text-muted-foreground sm:mb-8 sm:mt-20 sm:text-base md:text-lg">
            {t.hero.description}
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="w-full max-w-xs bg-primary px-8 text-base hover:bg-primary/90 hover:shadow-[0_0_40px_oklch(0.55_0.22_27/0.5)] sm:w-auto">
              <a href="tel:+37064642288">
                <Phone className="h-5 w-5" />
                {t.hero.callBtn}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full max-w-xs border-primary/40 bg-background/40 px-8 text-base backdrop-blur-sm hover:bg-primary/10 sm:w-auto">
              <a href="#meniu">
                <ShoppingCart className="h-5 w-5" />
                {t.hero.menuBtn}
              </a>
            </Button>
          </div>
        </div>

      </section>

      {/* Menu Categories */}
      <section id="meniu" className="relative py-20 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">{t.menu.eyebrow}</p>
            <h2 className="font-display text-5xl tracking-wider md:text-7xl">
              {t.menu.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              {t.menu.subtitle}
            </p>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="rounded-lg border border-border bg-card/60 p-12 text-center text-muted-foreground">
              {t.menu.empty}
            </div>
          )}

          {!loading && categories.length > 0 && (
            <>
              {/* Favorites toggle */}
              <div className="mx-auto mb-6 flex max-w-2xl justify-center">
                <button
                  type="button"
                  onClick={() => setFavoritesOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-2 rounded-md border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                    favoritesOnly
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_0_20px_oklch(0.55_0.22_27/0.4)]"
                      : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                  aria-pressed={favoritesOnly}
                >
                  <Heart className={`h-4 w-4 ${favoritesOnly ? "fill-current" : ""}`} />
                  Mėgstamiausi
                  {favCount > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        favoritesOnly
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-primary/10 text-primary"
                      }`}
                    >
                      {favCount}
                    </span>
                  )}
                </button>
              </div>

              {!favoritesOnly && (
                <div className="sticky top-[72px] z-30 -mx-6 mb-10 border-y border-border/40 bg-background/85 px-4 py-3 backdrop-blur-md sm:px-6">
                  <div className="relative flex items-center gap-2">
                    {/* Leading round "all categories" toggle */}
                    <button
                      type="button"
                      onClick={() => setAllCategoriesView((v) => !v)}
                      aria-label={allCategoriesView ? "Sutraukti kategorijas" : "Visos kategorijos"}
                      aria-pressed={allCategoriesView}
                      className="relative z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105"
                    >
                      <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${allCategoriesView ? "rotate-180" : ""}`} />
                    </button>

                    <LayoutGroup>
                    <motion.div
                      ref={categoryScrollerRef}
                      layout
                       className={
                         allCategoriesView
                           ? "grid flex-1 grid-cols-2 items-center gap-x-2 gap-y-1 py-1 sm:grid-cols-3 lg:grid-cols-4"
                           : "no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto overflow-y-visible scroll-smooth touch-pan-x overscroll-x-contain snap-x snap-mandatory scroll-px-2 px-1 py-2"
                       }
                      style={allCategoriesView ? undefined : { WebkitOverflowScrolling: "touch" }}
                      transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                    >
                      {categories.map((cat) => {
                        const isActive = activeCategory === cat.slug && !allCategoriesView;
                        const iconSrc =
                          getCategoryIcon(cat.slug) ??
                          cat.items.find((it) => it.imageUrl)?.imageUrl ??
                          null;
                        const label = pickTranslation(cat.name, cat.nameTranslations, lang);
                        return (
                          <motion.button
                            key={cat.slug}
                            layout
                            transition={{ layout: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                            type="button"
                            data-cat-slug={cat.slug}
                            onClick={() => {
                              setAllCategoriesView(false);
                              setActiveCategory(cat.slug);
                              setTimeout(() => {
                                const el = document.getElementById("category-items");
                                if (el) {
                                  const top = el.getBoundingClientRect().top + window.scrollY - 130;
                                  window.scrollTo({ top, behavior: "smooth" });
                                }
                              }, 50);
                            }}
                            aria-pressed={isActive}
                       className={`group flex ${allCategoriesView ? "w-full" : "w-[180px] sm:w-[200px]"} shrink-0 snap-start items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:scale-[1.04] ${
                               isActive
                                 ? "bg-secondary text-foreground shadow-md scale-[1.02]"
                                 : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"
                             }`}
                          >
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-charcoal transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[8deg]">
                              {iconSrc ? (
                                <img
                                  src={iconSrc}
                                  alt=""
                                  width={40}
                                  height={40}
                                  loading="lazy"
                                  className="h-full w-full object-contain p-0.5 transition-transform duration-500 group-hover:scale-110"
                                />
                              ) : (
                                <UtensilsCrossed className="h-5 w-5 text-primary/60" />
                              )}
                            </span>
                            <span className="flex-1 truncate pr-1 text-left text-xs font-medium tracking-wide sm:text-sm">
                              {label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                    </LayoutGroup>

                    {/* Trailing scroll buttons - absolutely positioned with gradient fade so text is not abruptly cut off */}
                    {!allCategoriesView && canScrollLeft && (
                      <div className="pointer-events-none absolute inset-y-0 left-14 z-10 hidden w-20 items-center justify-start bg-gradient-to-r from-background via-background/85 to-transparent sm:flex">
                        <button
                          type="button"
                          onClick={() => scrollCategories("left")}
                          aria-label="Slinkti į kairę"
                          className="pointer-events-auto ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/90 text-foreground shadow-sm backdrop-blur transition hover:bg-secondary hover:scale-105"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    {!allCategoriesView && canScrollRight && (
                      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-20 items-center justify-end bg-gradient-to-l from-background via-background/85 to-transparent sm:flex">
                        <button
                          type="button"
                          onClick={() => scrollCategories("right")}
                          aria-label="Slinkti į dešinę"
                          className="pointer-events-auto mr-1 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary/90 text-foreground shadow-sm backdrop-blur transition hover:bg-secondary hover:scale-105"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(() => {
                if (favoritesOnly) {
                  const favItems = categories.flatMap((cat) =>
                    cat.items
                      .filter((it) => isFavorite(it.id))
                      .map((it) => ({ item: it, catSlug: cat.slug })),
                  );
                  if (favItems.length === 0) {
                    return (
                      <div className="rounded-lg border border-border bg-card/60 p-12 text-center text-muted-foreground">
                        <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                        <p className="font-display text-xl tracking-wider">Sąrašas tuščias</p>
                        <p className="mt-2 text-sm">
                          Spauskite ❤️ ant patiekalo, kad išsaugotumėte mėgstamiausią.
                        </p>
                      </div>
                    );
                  }
                  return (
                    <div id="category-items" className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                      {favItems.map(({ item, catSlug }) => (
                        <MenuItemCard key={`fav-${catSlug}-${item.id}`} item={item} />
                      ))}
                    </div>
                  );
                }

                // When the "all categories" view is on, only show the category list above —
                // hide the items grid entirely so the user just sees all categories.
                if (allCategoriesView) return null;

                const visibleCats = activeCategory
                  ? categories.filter((cat) => cat.slug === activeCategory)
                  : [];

                if (visibleCats.length === 0) return null;

                return (
                  <div id="category-items" className="space-y-16">
                    {visibleCats.map((cat) => {
                      const isExpanded = expandedCategories[cat.slug] ?? false;
                      // Show a limited number of items per category until the user
                      // clicks "Matyti daugiau".
                      const limit = MOBILE_LIMIT;
                      const hasMore = cat.items.length > limit;
                      const visibleItems = isExpanded ? cat.items : cat.items.slice(0, limit);
                      const hiddenCount = cat.items.length - limit;
                      return (
                        <div key={cat.slug}>
...
                          <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                            {visibleItems.map((item) => (
                              <MenuItemCard key={`${cat.slug}-${item.id}`} item={item} />
                            ))}
                          </div>

                          {/* "Matyti daugiau" — when there are more items in this category */}
                          {hasMore && !isExpanded && (
                            <div className="mt-8 flex justify-center">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedCategories((prev) => ({ ...prev, [cat.slug]: true }))
                                }
                                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-sm font-medium uppercase tracking-wider text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                              >
                                <span>Matyti daugiau</span>
                                <span className="text-[11px] opacity-80 normal-case tracking-normal">
                                  · +{hiddenCount}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      </section>
      <section id="apie" className="relative py-28 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-card/30 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">{t.about.eyebrow}</p>
          <h2 className="mb-8 font-display text-5xl tracking-wider md:text-6xl">
            {t.about.title}
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            <span className="text-foreground">{t.about.p1Bold}</span>{t.about.p1}
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {t.about.p2}
          </p>

          <div className="mt-12 grid grid-cols-3 gap-8 border-y border-border py-8">
            <div>
              <div className="font-display text-4xl text-primary md:text-5xl">15+</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{t.about.statYears}</div>
            </div>
            <div>
              <div className="font-display text-4xl text-primary md:text-5xl">50+</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{t.about.statDishes}</div>
            </div>
            <div>
              <div className="font-display text-4xl text-primary md:text-5xl">100%</div>
              <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{t.about.statFresh}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reservation */}
      <section id="rezervacija" className="relative overflow-hidden py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--ember)_0%,_transparent_65%)] opacity-20" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-4xl px-6">
          <div className="text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">{t.nav.reservation}</p>
            <h2 className="font-display text-4xl tracking-wider md:text-6xl">
              {t.nav.reservation}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card/90 to-card/40 p-8 backdrop-blur md:p-12"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--ember)]/15 blur-3xl" />

            <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 ring-1 ring-primary/30 md:mx-0 md:h-20 md:w-20">
                <UtensilsCrossed className="h-8 w-8 text-primary md:h-10 md:w-10" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="font-display text-2xl tracking-wide md:text-3xl">
                  {t.reservationSection.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground md:text-base">
                  {t.reservationSection.subtitle}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.2em] text-muted-foreground md:justify-start">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" /> Vytauto g. 11A</span>
                </div>

                <a
                  href="https://tango-pizzagrill.tablein.com/lt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_10px_30px_oklch(0.55_0.22_27/0.45)] transition-all hover:scale-105 hover:bg-primary/90 md:text-lg"
                >
                  {t.reservationSection.cta}
                  <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="kontaktai" className="relative py-28 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">{t.contact.eyebrow}</p>
            <h2 className="font-display text-5xl tracking-wider md:text-7xl">
              {t.contact.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Phone className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-display text-xl tracking-wider">{t.contact.phone}</h3>
              <a href="tel:+37064642288" className="text-muted-foreground hover:text-primary">
                +370 646 42288
              </a>
            </div>
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <MapPin className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-display text-xl tracking-wider">{t.contact.address}</h3>
              <a
                href="https://maps.google.com/?q=Vytauto+g.+11A,+Prienai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary"
              >
                Vytauto g. 11A, Prienai 59124
              </a>
            </div>
            <div className="rounded-lg border border-border bg-card p-8">
              <Clock className="mx-auto mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-4 text-center font-display text-xl tracking-wider">{t.contact.hours}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {workingHoursDef.map((d, idx) => {
                  const isToday = idx === todayIndex;
                  return (
                    <li
                      key={d.key}
                      className={`flex justify-between gap-4 rounded px-2 py-0.5 ${
                        isToday ? "bg-primary/10 text-primary" : ""
                      }`}
                    >
                      <span className={`font-medium ${isToday ? "text-primary" : "text-foreground/80"}`}>
                        {t.days[d.key]}
                        {isToday && status && (
                          <span
                            className={`ml-2 text-[10px] uppercase tracking-wider ${
                              status.isOpen ? "text-green-400" : "text-primary"
                            }`}
                          >
                            • {status.isOpen ? t.contact.open : t.contact.closed}
                          </span>
                        )}
                      </span>
                      <span>{d.hours}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="mt-12 overflow-hidden rounded-lg border border-border bg-card">
            <iframe
              title="Tango Pizza & Grill žemėlapis"
              src="https://www.google.com/maps?q=Vytauto+g.+11A,+Prienai,+59124&output=embed"
              width="100%"
              height="450"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full grayscale-[20%] contrast-110"
              style={{ border: 0 }}
            />
            <div className="flex flex-col items-center justify-center gap-2 border-t border-border bg-card/60 p-4 sm:flex-row">
              <Button
                onClick={handleNavigateClick}
                disabled={locating}
                className="bg-primary hover:bg-primary/90 hover:shadow-[0_0_30px_oklch(0.55_0.22_27/0.5)]"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {locating ? t.contact.locating : t.contact.navigateBtn}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews */}
      <section id="atsiliepimai" className="relative py-28 md:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/20 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">{t.reviews.eyebrow}</p>
            <h2 className="font-display text-5xl tracking-wider md:text-6xl">
              {t.reviews.title}
            </h2>
            <div className="mx-auto mt-4 h-1 w-20 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
              {t.reviews.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-sm md:p-12">
            <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-between md:gap-12">
              <AnimatedReviewStats basedOnLabel={t.reviews.basedOn} ofLabel={t.reviews.of} />

              <div className="flex flex-1 flex-col items-center gap-4 md:items-end">
                <p className="max-w-md text-center text-sm leading-relaxed text-muted-foreground md:text-right">
                  {t.reviews.description}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <a
                      href="https://www.google.com/maps/place/TANGO+PIZZA%26GRILL/@54.6327022,23.9550151,9z/data=!4m6!3m5!1s0x46e736b6cf1381e3:0x7e94cd705d18b968!8m2!3d54.6330538!4d23.9475124!16s%2Fg%2F1tc_7bwr?entry=ttu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Star className="h-4 w-4 fill-current" />
                      {t.reviews.readBtn}
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-primary/40 hover:bg-primary/10">
                    <a
                      href="https://www.google.com/maps/place/TANGO+PIZZA%26GRILL/@54.6327022,23.9550151,9z/data=!4m8!3m7!1s0x46e736b6cf1381e3:0x7e94cd705d18b968!8m2!3d54.6330538!4d23.9475124!9m1!1b1!16s%2Fg%2F1tc_7bwr?entry=ttu"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t.reviews.leaveBtn}
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] uppercase tracking-wider text-muted-foreground/70">
            {t.reviews.disclaimer}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-charcoal py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <img src={tangoLogo} alt="Tango Pizza & Grill" width={40} height={40} loading="lazy" className="h-10 w-10 object-contain" />
            <span className="font-display text-xl tracking-wider">TANGO PIZZA & GRILL</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/TangoPizza/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tango Pizza & Grill Facebook"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_20px_oklch(0.55_0.22_27/0.4)]"
              >
                <Facebook className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://www.instagram.com/tangopizzaandgrill/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Tango Pizza & Grill Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_20px_oklch(0.55_0.22_27/0.4)]"
              >
                <Instagram className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
              <a
                href="https://rekvizitai.vz.lt/imone/ii_floravila/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Įmonės rekvizitai"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-primary hover:shadow-[0_0_20px_oklch(0.55_0.22_27/0.4)]"
              >
                <Building2 className="h-4 w-4 transition-transform group-hover:scale-110" />
              </a>
            </div>
            <a
              href="mailto:info@tangopizza.lt"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              info@tangopizza.lt
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground md:text-right">
            <Link to="/naudojimo-salygos" className="hover:text-primary">{t.footer.terms}</Link>
            <span className="mx-1.5">·</span>
            <Link to="/privatumo-politika" className="hover:text-primary">{t.footer.privacy}</Link>
            <span className="mx-1.5">·</span>
            <Link to="/pristatymo-politika" className="hover:text-primary">{t.footer.delivery}</Link>
            <span className="mx-1.5">·</span>
            {t.footer.rights}
          </p>
        </div>
      </footer>
    </div>
  );
}
