import { useState, useEffect } from "react";
import { useMagneticHover } from "../hooks/useMagneticHover";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

const EMAIL = "tomardevesh012@gmail.com";

function NavLink({ href, children }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover(0.3);
  return (
    
    <a  ref={ref}
      href={href}
      className="nav-link"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  );
}

function CopyEmailButton({ className = "" }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const textarea = document.createElement("textarea");
      textarea.value = EMAIL;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
  };

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <button
      type="button"
      className={`copy-email-btn${copied ? " is-copied" : ""} ${className}`}
      onClick={handleCopy}
      aria-label="Copy email address"
    >
      {copied ? (
        <span className="copy-email-btn__label">Copied!</span>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ctaHover = useMagneticHover(0.25);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner">
        {/* Logo */}
        <a href="/" className="logo">
          Devesh<span className="logo__dot">.</span>
        </a>

        {/* Desktop nav */}
        <nav className="nav" aria-label="Main navigation">
          <NavLink href="#work">Projects</NavLink>
          <NavLink href="#projects">Work Experience</NavLink>
          <NavLink href="#about">About</NavLink>
        </nav>

        {/* Right cluster */}
        <div className="header__right">
          <ThemeToggle />

          <div className="header__email-group">
            <a
              ref={ctaHover.ref}
              href={`mailto:${EMAIL}`}
              className="header__cta"
              onMouseMove={ctaHover.onMouseMove}
              onMouseLeave={ctaHover.onMouseLeave}
            >
              {EMAIL}
            </a>
            <CopyEmailButton />
          </div>

          {/* Hamburger for mobile */}
          <button
            className={`hamburger${menuOpen ? " is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`}>
        <a href="#work" onClick={() => setMenuOpen(false)}>Projects</a>
        <a href="#projects" onClick={() => setMenuOpen(false)}>Work Experience</a>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <div className="mobile-menu__email-row">
          <a
            href={`mailto:${EMAIL}`}
            onClick={() => setMenuOpen(false)}
          >
            {EMAIL}
          </a>
          <CopyEmailButton />
        </div>
      </div>
    </header>
  );
}