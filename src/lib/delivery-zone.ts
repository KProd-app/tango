// Tango Pizza & Grill — Vytauto g. 13-3, Prienai
export const RESTAURANT_LOCATION = {
  lat: 54.6383,
  lng: 23.945,
  name: "Tango Pizza & Grill",
  address: "Vytauto g. 13-3, Prienai",
};

export const MAX_DELIVERY_RADIUS_KM = 15;
export const MIN_ORDER_FOR_DELIVERY = 15;

// Tariff table from /pristatymo-politika
const TARIFFS: { maxKm: number; price: number }[] = [
  { maxKm: 3, price: 3 },
  { maxKm: 4, price: 4 },
  { maxKm: 5, price: 5 },
  { maxKm: 6, price: 6 },
  { maxKm: 7, price: 7 },
  { maxKm: 8, price: 8 },
  { maxKm: 9, price: 9 },
  { maxKm: 10, price: 10 },
  { maxKm: 11, price: 11 },
  { maxKm: 12, price: 12 },
  { maxKm: 13, price: 13 },
  { maxKm: 14, price: 14 },
  { maxKm: 15, price: 15 },
];

/** Straight-line (Haversine) distance in km. Used as fallback. */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371; // Earth radius km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Returns delivery fee in EUR or null if outside zone. */
export function deliveryFeeFor(km: number): number | null {
  if (km > MAX_DELIVERY_RADIUS_KM) return null;
  for (const t of TARIFFS) {
    if (km <= t.maxKm) return t.price;
  }
  return null;
}

export function isWithinZone(km: number): boolean {
  return km <= MAX_DELIVERY_RADIUS_KM;
}

/**
 * Real driving distance in km via OSRM public routing API.
 * Falls back to Haversine on failure.
 */
export async function drivingDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): Promise<{ km: number; source: "driving" | "straight" }> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=false`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("OSRM error");
    const data = (await res.json()) as {
      routes?: Array<{ distance: number }>;
    };
    const meters = data.routes?.[0]?.distance;
    if (typeof meters !== "number") throw new Error("No route");
    return { km: meters / 1000, source: "driving" };
  } catch {
    return { km: distanceKm(a, b), source: "straight" };
  }
}
