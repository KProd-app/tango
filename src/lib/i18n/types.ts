export type Language = "lt" | "en" | "fr" | "pl" | "ru" | "es";

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: "lt", name: "Lietuvių", flag: "🇱🇹" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

export type TranslationKeys = {
  nav: {
    menu: string;
    about: string;
    contact: string;
    reviews: string;
    cart: string;
    admin: string;
    reservation: string;
  };
  hero: {
    badgeSince: string;
    badgeOpen: string;
    badgeClosed: string;
    tagline: string;
    description: string;
    callBtn: string;
    menuBtn: string;
  };
  menu: {
    eyebrow: string;
    title: string;
    subtitle: string;
    empty: string;
    pickPrompt: string;
    example: string;
    items: string;
    eyebrowCat: string;
  };
  about: {
    eyebrow: string;
    title: string;
    p1Bold: string;
    p1: string;
    p2: string;
    statYears: string;
    statDishes: string;
    statFresh: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    phone: string;
    address: string;
    hours: string;
    open: string;
    closed: string;
    navigateBtn: string;
    locating: string;
    geoUnsupported: string;
    geoDenied: string;
    geoError: string;
  };
  reviews: {
    eyebrow: string;
    title: string;
    subtitle: string;
    basedOn: string;
    of: string;
    description: string;
    readBtn: string;
    leaveBtn: string;
    disclaimer: string;
  };
  footer: {
    terms: string;
    privacy: string;
    delivery: string;
    rights: string;
  };
  cookies: {
    title: string;
    description: string;
    learnMore: string;
    accept: string;
    decline: string;
  };
  days: {
    mon: string;
    tue: string;
    wed: string;
    thu: string;
    fri: string;
    sat: string;
    sun: string;
  };
  reservationSection: {
    title: string;
    subtitle: string;
    cta: string;
  };
};
