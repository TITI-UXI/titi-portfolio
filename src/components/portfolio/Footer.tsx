// @ts-nocheck -- untyped JS-style component; types not enforced here
"use client";

import { useEffect, useRef, useState } from "react";
import ScrollVelocityMarquee from "@/components/motion/ScrollVelocityMarquee";
import CurvedReveal from "@/components/motion/CurvedReveal";
import MagneticButton from "@/components/motion/MagneticButton";

const CONTACT_CHANNELS = [
  { label: "Email", value: "hello@imanamanin.com", href: "mailto:hello@imanamanin.com" },
  { label: "Instagram", value: "@imanamanin", href: "https://instagram.com/imanamanin" },
  { label: "LinkedIn", value: "in/imanamanin", href: "https://linkedin.com/in/imanamanin" },
];

/** Live clock for a given IANA time zone, refreshed every 15s. */
function useLocalTime(timeZone) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 15_000);
    return () => clearInterval(id);
  }, [timeZone]);

  return time;
}

export default function Footer() {
  const footerRef = useRef(null);
  // Rasht shares Iran Standard Time with Tehran; no separate IANA zone for Rasht itself
  const rashtTime = useLocalTime("Asia/Tehran");

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-black text-white">
      {/* fill should match whatever section sits directly above the footer */}
      <CurvedReveal targetRef={footerRef} fill="#ffffff" />

      <ScrollVelocityMarquee className="border-y border-white/10" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 py-24 text-center">
        <MagneticButton
          href="mailto:hello@imanamanin.com"
          strength={0.3}
          className="flex h-56 w-56 items-center justify-center rounded-full border border-white/20
                     text-2xl font-semibold text-white transition-colors duration-300
                     hover:bg-white hover:text-black md:h-72 md:w-72 md:text-3xl"
        >
          Let&apos;s Talk
        </MagneticButton>

        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-sm">Rasht, Iran</span>
          <span className="font-mono text-lg text-white">{rashtTime || "--:--"}</span>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {CONTACT_CHANNELS.map((channel) => (
            <li key={channel.label}>
              <a
                href={channel.href}
                target="_blank"
                rel="noreferrer"
                className="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                {channel.value}
              </a>
            </li>
          ))}
        </ul>

        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} Iman Amanin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
