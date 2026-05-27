import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

const TARGET_RATING = 4.6;
const TARGET_COUNT = 3400;
const DURATION = 1600; // ms

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

type Props = {
  basedOnLabel: string;
  ofLabel: string;
};

export function AnimatedReviewStats({ basedOnLabel, ofLabel }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1
  const startedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const t0 = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / DURATION);
        setProgress(easeOutCubic(p));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
          }
        }
      },
      { threshold: 0.4 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const rating = TARGET_RATING * progress;
  const count = Math.round(TARGET_COUNT * progress);
  const formattedRating = rating.toFixed(1).replace(".", ",");
  const formattedCount =
    count >= 1000 ? `${(count / 1000).toFixed(1).replace(".", ",")}k` : `${count}`;

  return (
    <div ref={ref} className="text-center md:text-left">
      <div className="flex items-center justify-center gap-2 md:justify-start">
        <span className="font-display text-6xl text-primary md:text-7xl tabular-nums">
          {formattedRating}
        </span>
        <span className="text-2xl text-muted-foreground">/ 5</span>
      </div>
      <div
        className="mt-2 flex items-center justify-center gap-1 md:justify-start"
        aria-label={`${formattedRating} iš 5`}
      >
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <div key={i} className="relative h-5 w-5">
              <Star className="absolute inset-0 h-5 w-5 fill-primary/20 text-primary/20" />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
                aria-hidden
              >
                <Star className="h-5 w-5 fill-primary text-primary" />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {basedOnLabel}{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {formattedCount}+
        </span>{" "}
        {ofLabel}
      </p>
    </div>
  );
}
