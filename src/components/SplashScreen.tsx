import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tangoLogo from "@/assets/tango-logo.png";

const SHOWN_KEY = "tango_splash_shown";

export function SplashScreen() {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem(SHOWN_KEY);
  });

  useEffect(() => {
    if (!visible) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      sessionStorage.setItem(SHOWN_KEY, "1");
      setVisible(false);
    }, 2000);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.18 0.03 25) 0%, oklch(0.08 0.005 20) 70%)",
          }}
        >
          {/* Glow pulse */}
          <motion.div
            className="absolute h-[500px] w-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.6 0.24 30 / 0.35) 0%, transparent 70%)",
            }}
            animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
          />

          {/* Floating embers */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.22_35)]"
              style={{
                left: `${50 + (Math.random() - 0.5) * 60}%`,
                top: "70%",
                boxShadow: "0 0 8px oklch(0.68 0.22 35)",
              }}
              animate={{
                y: [-20, -300],
                opacity: [0, 1, 0],
                x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 80],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 1.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <motion.img
              src={tangoLogo}
              alt="Tango Pizza & Grill"
              className="h-32 w-auto drop-shadow-[0_0_30px_oklch(0.6_0.24_30_/_0.6)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Loading bar */}
            <div className="relative h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0.55 0.22 27), oklch(0.68 0.22 35))",
                  boxShadow: "0 0 12px oklch(0.6 0.24 30)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-display text-sm tracking-[0.4em] text-white/70"
            >
              KRAUNAMA…
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
