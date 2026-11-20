import gsap from "gsap";

export function initLightPanels() {
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference) and (pointer: fine)", () => {
    for (const panel of document.querySelectorAll(".light-panel")) {
      gsap.fromTo(panel, { "--panel-edge": "0px" }, {
        "--panel-edge": "-32px",
        ease: "none",
        scrollTrigger: { trigger: panel, start: "top bottom", end: "top 45%", scrub: true },
      });
    }
  });
  return () => media.revert();
}
