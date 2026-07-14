import { useState, useCallback } from "react";
import { useMagneticHover } from "../hooks/useMagneticHover";
import { EMAIL } from "../constants";
import "./Footer.css";

// Same clipboard safety net as the header CTA — mailto: still fires,
// this just guarantees the visitor ends up with the address either way.
function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const onClick = useCallback(() => {
    navigator.clipboard?.writeText(EMAIL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);
  return { copied, onClick };
}

const socials = [
  { label: "GitHub", href: "https://github.com/cazyyTom" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/devesh-tomar-82a450299/",
  },
];

function BigLink({ children, href }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover(0.2);
  return (
    <a
      ref={ref}
      href={href}
      className="footer__social-link"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const { ref: emailRef, onMouseMove, onMouseLeave } = useMagneticHover(0.18);
  const { copied, onClick: onEmailClick } = useCopyEmail();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <p className="footer__eyebrow">Open to remote internships</p>
          <a
            ref={emailRef}
            href={`mailto:${EMAIL}`}
            className="footer__big-email"
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onEmailClick}
          >
            {copied ? "Copied ✓" : EMAIL}
          </a>
        </div>

        <div className="footer__bottom">
          <div className="footer__col">
            <span className="footer__col-title">Sitemap</span>
            <a href="#work">Projects</a>
            <a href="#projects">Work Experience</a>
            <a href="#about">About</a>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Social</span>
            {socials.map((s) => (
              <BigLink key={s.label} href={s.href}>
                {s.label}
              </BigLink>
            ))}
          </div>
          <div className="footer__col footer__col--logo">
            <span className="logo">
              Devesh<span className="logo__dot">.</span>
            </span>
            <p className="footer__tagline">
              Full stack developer & fresher, based in IIT Roorkee, India — open
              to remote internship opportunities.
            </p>
          </div>
        </div>

        <div className="footer__legal">
          <span>© {year} Devesh. All rights reserved.</span>
          <span>Designed &amp; built with care.</span>
        </div>
      </div>
    </footer>
  );
}
