import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initExperienceMotion() {
  const section = document.querySelector('[data-section="experience"]');
  const panel = section.querySelector(".experience-panel");
  const header = document.querySelector(".site-header");
  // Sample the bottom of the fixed header, including its wrapped mobile layout.
  const boundary = () => header.getBoundingClientRect().height;
  function sync() {
    const { top, bottom } = panel.getBoundingClientRect();
    const edge = boundary() + 1;
    header.classList.toggle("over-experience", top <= edge && bottom > edge);
  }
  window.addEventListener("scroll", sync, { passive: true });
  ScrollTrigger.addEventListener("refresh", sync);
  const alignAnchors = () => {
    for (const target of [section, document.querySelector("#contact")]) {
      target.style.scrollMarginTop = `calc(${boundary()}px - var(--header-offset))`;
    }
    ScrollTrigger.refresh();
  };
  const observer = new ResizeObserver(alignAnchors);
  observer.observe(header);
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(panel, {
      y: () => Math.min(84, innerHeight * 0.1),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top 55%",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    gsap.from(section.querySelector("h2"), {
      yPercent: 18,
      opacity: 0.68,
      clipPath: "inset(0 0 62% 0)",
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 95%",
        end: "top 33%",
        scrub: true,
      },
    });
    for (const rule of section.querySelectorAll(".experience-rule")) {
      gsap.from(rule, {
        scaleX: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rule,
          start: "top 96%",
          end: "top 70%",
          scrub: true,
        },
      });
    }
  });
  return () => {
    observer.disconnect();
    media.revert();
    window.removeEventListener("scroll", sync);
    ScrollTrigger.removeEventListener("refresh", sync);
    header.classList.remove("over-experience");
    for (const target of [section, document.querySelector("#contact")])
      target.style.removeProperty("scroll-margin-top");
  };
}
