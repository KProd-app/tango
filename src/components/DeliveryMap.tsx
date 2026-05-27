import { lazy, Suspense, Component, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";

export type DeliveryMapProps = {
  selected: { lat: number; lng: number } | null;
  onSelect: (point: { lat: number; lng: number }) => void;
  className?: string;
};

// Retry dynamic import once, then force a reload to recover from stale chunks
// after a redeploy (avoids "Failed to fetch dynamically imported module" crash).
function loadMap(): Promise<{ default: React.ComponentType<DeliveryMapProps> }> {
  return import("./DeliveryMap.client")
    .then((m) => ({ default: m.DeliveryMapClient }))
    .catch(async (err) => {
      try {
        await new Promise((r) => setTimeout(r, 300));
        const m = await import("./DeliveryMap.client");
        return { default: m.DeliveryMapClient };
      } catch (e) {
        if (typeof window !== "undefined") {
          const key = "tango-map-reloaded";
          if (!sessionStorage.getItem(key)) {
            sessionStorage.setItem(key, "1");
            window.location.reload();
          }
        }
        throw e;
      }
    });
}

const LazyMap = lazy(loadMap);

const Fallback = () => (
  <div
    style={{ height: 280, width: "100%", borderRadius: 8 }}
    className="flex items-center justify-center bg-muted text-xs text-muted-foreground"
  >
    Kraunamas žemėlapis…
  </div>
);

const ErrorFallback = () => (
  <div
    style={{ height: 280, width: "100%", borderRadius: 8 }}
    className="flex items-center justify-center bg-muted px-4 text-center text-xs text-muted-foreground"
  >
    Žemėlapio įkelti nepavyko. Atnaujinkite puslapį.
  </div>
);

class MapBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    console.error("DeliveryMap load failed", err);
  }
  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

export function DeliveryMap(props: DeliveryMapProps) {
  return (
    <ClientOnly fallback={<Fallback />}>
      <MapBoundary>
        <Suspense fallback={<Fallback />}>
          <LazyMap {...props} />
        </Suspense>
      </MapBoundary>
    </ClientOnly>
  );
}
