import { useEffect, useRef } from "react";

/**
 * Reveal-on-scroll — attaches an IntersectionObserver to the returned ref.
 * Adds class `is-visible` when the element enters the viewport.
 */
export function useRevealOnScroll(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("is-visible");
      return;
    }
    el.classList.add("reveal-ready");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.classList.remove("reveal-ready");
    };
  }, [threshold]);

  return ref;
}
