import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initProjectsMotion() {
  const section = document.querySelector("#work");
  const stack = section.querySelector(".project-stack");
  const sheets = [...stack.querySelectorAll(".project-sheet")];
  const markers = [...stack.querySelectorAll(".project-marker")];
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(section.querySelector("h2"), {
      opacity: 0.68,
      scale: 0.84,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top 42%",
        scrub: true,
      },
    });
  });
  media.add(
    "(min-width:62rem) and (not (pointer: coarse)) and (prefers-reduced-motion:no-preference)",
    () => {
      const controller = new AbortController();
      const { signal } = controller;
      const tops = [];
      function measure() {
        const header = document.querySelector(".site-header").offsetHeight;
        sheets.forEach((sheet, i) => {
          // Tall cards must scroll past their last line before they stick.
          tops[i] = Math.min(
            header + 12 + i * 10,
            innerHeight - sheet.offsetHeight - 12,
          );
          sheet.style.setProperty("--pin-top", tops[i] + "px");
        });
      }
      measure();
      stack.classList.add("is-stacked");
      ScrollTrigger.addEventListener("refreshInit", measure);
      sheets.forEach((sheet, i) => {
        if (markers[i + 1]) {
          gsap.to(sheet.firstElementChild, {
            scale: 0.946,
            y: -16,
            filter: "brightness(0.80)",
            ease: "none",
            scrollTrigger: {
              trigger: markers[i + 1],
              start: "top 94%",
              end: () => "top " + Math.max(60, tops[i + 1]) + "px",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
        const collage = sheet.querySelector(".project-collage");
        const pictures = collage.querySelector(".project-pictures");
        if (!pictures) return;
        gsap.fromTo(
          pictures,
          { "--drift": "9px" },
          {
            "--drift": "-9px",
            ease: "none",
            scrollTrigger: {
              trigger: markers[i],
              start: "top bottom",
              end: () => "+=" + (innerHeight + sheet.offsetHeight),
              scrub: true,
            },
          },
        );
        const reset = () => {
          pictures.style.removeProperty("--rx");
          pictures.style.removeProperty("--ry");
        };
        collage.addEventListener(
          "pointermove",
          (e) => {
            const bounds = collage.getBoundingClientRect();
            pictures.style.setProperty(
              "--rx",
              2.5 - (5 * (e.clientY - bounds.top)) / bounds.height + "deg",
            );
            pictures.style.setProperty(
              "--ry",
              (6 * (e.clientX - bounds.left)) / bounds.width - 3 + "deg",
            );
          },
          { signal },
        );
        collage.addEventListener("pointerleave", reset, { signal });
        signal.addEventListener("abort", reset, { once: true });
      });
      // Bring keyboard focus back above any incoming sheet that obscures it.
      stack.addEventListener(
        "focusin",
        (event) => {
          if (!event.target.matches(":focus-visible")) return;
          const sheet = event.target.closest(".project-sheet");
          const next = sheets[sheets.indexOf(sheet) + 1];
          if (
            next &&
            next.getBoundingClientRect().top <
              event.target.getBoundingClientRect().bottom
          ) {
            markers[sheets.indexOf(sheet)].scrollIntoView({
              block: "start",
              behavior: "instant",
            });
          }
        },
        { signal },
      );
      const observer = new ResizeObserver(() => ScrollTrigger.refresh());
      sheets.forEach((sheet) => observer.observe(sheet));
      return () => {
        observer.disconnect();
        controller.abort();
        ScrollTrigger.removeEventListener("refreshInit", measure);
        stack.classList.remove("is-stacked");
        sheets.forEach((sheet) => sheet.style.removeProperty("--pin-top"));
      };
    },
  );
  return () => media.revert();
}
