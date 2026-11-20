import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initAboutMotion() {
  const media = gsap.matchMedia();
  const about = document.querySelector("#about");
  const title = about.querySelector("h2");
  media.add(
    "(prefers-reduced-motion: no-preference) and (pointer:fine)",
    () => {
      const move = (e) => {
        const r = title.parentElement.getBoundingClientRect();
        title.style.transform = `perspective(650px) rotateY(${8 * ((e.clientX - r.left) / r.width - 0.5)}deg) rotateX(${-6 * ((e.clientY - r.top) / r.height - 0.5)}deg)`;
      };
      const reset = () => title.style.removeProperty("transform");
      const stage = title.parentElement;
      stage.addEventListener("pointermove", move);
      stage.addEventListener("pointerleave", reset);
      return () => {
        stage.removeEventListener("pointermove", move);
        stage.removeEventListener("pointerleave", reset);
        reset();
      };
    },
  );
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const copy = about.querySelector(".about-copy");
    const sources = [...copy.querySelectorAll(".bio-line-source")].map((p) => [
      p,
      p.textContent,
    ]);
    let context;
    let width = 0;
    let active = true;
    function split() {
      if (!active) return;
      context?.revert();
      context = gsap.context(() => {
        for (const [p, text] of sources) {
          p.textContent = text;
          const node = p.firstChild;
          const range = document.createRange();
          const lines = [];
          let top;
          for (const word of text.matchAll(/\S+/g)) {
            range.setStart(node, word.index);
            range.setEnd(node, word.index + word[0].length);
            const y = range.getBoundingClientRect().top;
            if (top === undefined || Math.abs(top - y) > 2) lines.push([]);
            lines.at(-1).push(word[0]);
            top = y;
          }
          p.replaceChildren(
            ...lines.map((words) => {
              const span = document.createElement("span");
              span.className = "bio-line";
              span.textContent = words.join(" ") + " ";
              return span;
            }),
          );
          gsap.from(p.children, {
            y: 14,
            opacity: 0.68,
            filter: "blur(3px)",
            stagger: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: p,
              start: "top 95%",
              end: "bottom 73%",
              scrub: true,
            },
          });
        }
      }, copy);
      ScrollTrigger.refresh();
    }
    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width !== width) {
        width = entry.contentRect.width;
        split();
      }
    });
    observer.observe(copy);
    document.fonts.ready.then(split);
    return () => {
      active = false;
      observer.disconnect();
      context?.revert();
      for (const [p, text] of sources) p.textContent = text;
    };
  });
  return () => media.revert();
}
