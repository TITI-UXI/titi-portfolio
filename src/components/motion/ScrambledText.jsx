"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const DEFAULT_CHARS = "!<>-_\\/[]{}—=+*^?#$%&";

function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)];
}

/**
 * Scrambles through random characters before settling into `text`.
 *
 * trigger="view"  -> plays once when it enters the viewport (default)
 * trigger="hover" -> plays every time the mouse enters
 * trigger="both"  -> plays on first view, then replays on hover
 */
export default function ScrambledText({
  text,
  as: Tag = "span",
  className = "",
  trigger = "view",
  chars = DEFAULT_CHARS,
  duration = 900, // ms, total time to fully resolve
  stepDelay = 35, // ms between scramble frames
}) {
  const ref = useRef(null);
  const intervalRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const [display, setDisplay] = useState(text);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const totalSteps = Math.max(1, Math.round(duration / stepDelay));

  const play = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    let step = 0;

    intervalRef.current = setInterval(() => {
      step += 1;
      const revealCount = Math.floor((step / totalSteps) * text.length);

      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            return i < revealCount ? ch : randomChar(chars);
          })
          .join("")
      );

      if (step >= totalSteps) {
        clearInterval(intervalRef.current);
        setDisplay(text);
      }
    }, stepDelay);
  };

  useEffect(() => {
    if ((trigger === "view" || trigger === "both") && inView && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      play();
    }
    return () => intervalRef.current && clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, trigger]);

  const handleMouseEnter = () => {
    if (trigger === "hover" || trigger === "both") play();
  };

  return (
    <Tag
      ref={ref}
      onMouseEnter={handleMouseEnter}
      className={className}
      style={{ willChange: "transform", display: "inline-block" }}
    >
      {display}
    </Tag>
  );
}
