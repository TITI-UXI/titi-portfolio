"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Splits `text` into words and floats each one up with a slight random
 * rotation as the paragraph scrolls into view, staggered word by word.
 * Reverses if the user scrolls back up past the trigger.
 */
export default function ScrollFloatText({
  text,
  className = "",
  as: Tag = "p",
  stagger = 0.04,
  distance = 24,
  rotation = 6,
}) {
  const containerRef = useRef(null);
  const words = text.split(" ");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const wordEls = containerRef.current.querySelectorAll("[data-word]");

      gsap.fromTo(
        wordEls,
        {
          y: distance,
          rotate: () => gsap.utils.random(-rotation, rotation),
          opacity: 0,
        },
        {
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
          stagger,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [stagger, distance, rotation]);

  return (
    <Tag ref={containerRef} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          data-word
          style={{
            display: "inline-block",
            willChange: "transform, opacity",
            marginRight: "0.28em",
          }}
        >
          {word}
        </span>
      ))}
    </Tag>
  );
}
