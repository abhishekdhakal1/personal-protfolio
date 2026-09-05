import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3";
}

// Splits text into words and reveals them with a GSAP ScrollTrigger-driven
// stagger (clip + rise) the moment the element scrolls into view.
export function TextReveal({ text, className, as = "span" }: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const Tag = as as any;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLElement>(".reveal-word");
    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.055,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    }, el);
    return () => ctx.revert();
  }, [text]);

  return (
    <Tag ref={containerRef} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden align-top mr-[0.28em] pb-[0.1em]">
          <span className="reveal-word inline-block">{word}</span>
        </span>
      ))}
    </Tag>
  );
}
