import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export function startLoop(render) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  const media = gsap.matchMedia();
  let lenis;
  media.add("(prefers-reduced-motion: no-preference)", () => {
    lenis = new Lenis({ autoRaf: false, syncTouch: false });
    lenis.on("scroll", ScrollTrigger.update);
    return () => {
      lenis.destroy();
      lenis = undefined;
    };
  });

  function navigate(event) {
    const anchor = event.target.closest?.('a[href^="#"]');
    if (!lenis || !anchor || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const target = document.getElementById(anchor.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    if (location.hash !== anchor.hash) history.pushState(null, "", anchor.hash);
    target.focus({ preventScroll: true });
    lenis.scrollTo(target);
  }

  // Lenis consumes milliseconds; GSAP's ticker supplies seconds.
  const scroll = (seconds) => lenis?.raf(seconds * 1000);
  gsap.ticker.add(scroll, false, true);
  const draw = (time, deltaMs) => render(time, deltaMs, lenis?.velocity || 0);
  gsap.ticker.add(draw);
  document.addEventListener("click", navigate);
  return () => {
    document.removeEventListener("click", navigate);
    gsap.ticker.remove(scroll);
    gsap.ticker.remove(draw);
    media.revert();
  };
}
