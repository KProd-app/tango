import { useEffect, useRef, useState } from "react";

import L from "leaflet";
import { Maximize2, X } from "lucide-react";
import {
  RESTAURANT_LOCATION,
  distanceKm,
  isWithinZone,
} from "@/lib/delivery-zone";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const restaurantIcon = L.divIcon({
  className: "",
  html: `<div style="background:#dc2626;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;color:white;font-size:14px;font-weight:bold;">🍕</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export type DeliveryMapClientProps = {
  selected: { lat: number; lng: number } | null;
  onSelect: (point: { lat: number; lng: number }) => void;
  className?: string;
};

export function DeliveryMapClient({
  selected,
  onSelect,
  className,
}: DeliveryMapClientProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isFullscreenRef = useRef(false);
  isFullscreenRef.current = isFullscreen;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng],
      zoom: 12,
      scrollWheelZoom: false,
      dragging: false,
      doubleClickZoom: false,
      zoomControl: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    L.marker([RESTAURANT_LOCATION.lat, RESTAURANT_LOCATION.lng], {
      icon: restaurantIcon,
    })
      .addTo(map)
      .bindTooltip(RESTAURANT_LOCATION.name, { permanent: false });

    map.on("click", (e) => {
      if (!isFullscreenRef.current) {
        setIsFullscreen(true);
        return;
      }
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    if (selected) {
      const km = distanceKm(RESTAURANT_LOCATION, selected);
      const inZone = isWithinZone(km);
      const color = inZone ? "#22c55e" : "#dc2626";
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${color};width:22px;height:22px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,.5);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      markerRef.current = L.marker([selected.lat, selected.lng], { icon }).addTo(map);
      markerRef.current.bindTooltip(
        `${km.toFixed(1)} km ${inZone ? "✓ zonoje" : "✗ už zonos"}`,
        { permanent: false },
      );
      if (!map.getBounds().contains([selected.lat, selected.lng])) {
        map.setView([selected.lat, selected.lng], Math.max(map.getZoom(), 12));
      }
    }
  }, [selected]);

  // Resize map when toggling fullscreen so tiles fill the container
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const t = setTimeout(() => map.invalidateSize(), 50);
    return () => clearTimeout(t);
  }, [isFullscreen]);

  // Lock body scroll while fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey, true);
    };
  }, [isFullscreen]);

  // Inline slot — where the map lives normally
  const inlineSlotRef = useRef<HTMLDivElement>(null);
  // Fullscreen slot — created in a portal to body, the map is reparented here
  const fsSlotRef = useRef<HTMLDivElement>(null);

  // Reparent the persistent leaflet container between slots when fullscreen toggles
  useEffect(() => {
    const node = containerRef.current;
    const map = mapRef.current;
    if (!node) return;
    const target = isFullscreen ? fsSlotRef.current : inlineSlotRef.current;
    if (target && node.parentElement !== target) {
      target.appendChild(node);
    }
    if (isFullscreen) {
      node.style.position = "absolute";
      node.style.inset = "0";
      node.style.width = "100%";
      node.style.height = "100%";
      node.style.borderRadius = "0";
      if (map) {
        map.dragging.enable();
        map.scrollWheelZoom.enable();
        map.doubleClickZoom.enable();
        map.touchZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
      }
    } else {
      node.style.position = "";
      node.style.inset = "";
      node.style.width = "100%";
      node.style.height = "160px";
      node.style.borderRadius = "8px";
      node.style.overflow = "hidden";
      if (map) {
        map.dragging.disable();
        map.scrollWheelZoom.disable();
        map.doubleClickZoom.disable();
        map.touchZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
      }
    }
    setTimeout(() => mapRef.current?.invalidateSize(), 60);
  }, [isFullscreen]);

  const closeBtn = (
    <button
      type="button"
      onClick={() => setIsFullscreen(false)}
      aria-label="Uždaryti žemėlapį"
      className="absolute right-3 top-3 z-[1000] flex h-10 w-10 items-center justify-center rounded-md bg-background/95 text-foreground shadow-lg ring-1 ring-border hover:bg-background"
    >
      <X className="h-5 w-5" />
    </button>
  );

  const selectedInfo = selected
    ? (() => {
        const km = distanceKm(RESTAURANT_LOCATION, selected);
        const inZone = isWithinZone(km);
        return { km, inZone };
      })()
    : null;

  return (
    <>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="flex w-full items-center justify-between gap-3 rounded-md border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground shadow-sm transition hover:bg-accent"
        >
          <span className="flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            {selected ? "Pakeisti vietą žemėlapyje" : "Pasirinkti vietą žemėlapyje"}
          </span>
          {selectedInfo && (
            <span
              className={
                "rounded-full px-2 py-0.5 text-xs " +
                (selectedInfo.inZone
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700")
              }
            >
              {selectedInfo.km.toFixed(1)} km {selectedInfo.inZone ? "✓" : "✗"}
            </span>
          )}
        </button>
      </div>

      {/* Hidden persistent host for the leaflet container when not fullscreen */}
      <div ref={inlineSlotRef} style={{ display: "none" }} aria-hidden>
        <div
          ref={containerRef}
          className={className}
          style={{ width: "100%", height: "1px" }}
          aria-label="Pristatymo zonos žemėlapis"
        />
      </div>

      {isFullscreen ? (
        <div
          className="fixed inset-0 z-[9999] bg-background"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={fsSlotRef} className="absolute inset-0" />
          {closeBtn}
        </div>
      ) : null}
    </>
  );
}
