import { useState, useEffect, useRef } from "react";
import { EMAIL } from "../constants";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

const navigation = [
  { href: "#work", label: "Projects" },
  { href: "#projects", label: "Work Experience" },
  { href: "#about", label: "About" },
];

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
  const menuButton = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnResize = () => setMenuOpen(false);
    document.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnResize);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnResize);
    };
  }, [menuOpen]);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>
      <div className="header__inner">
        <a href="/" className="logo">Devesh<span className="logo__dot">.</span></a>
        <nav className="nav" aria-label="Main navigation">
          {navigation.map(({ href, label }) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="header__right">
          <div className="header__email-group">
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <CopyEmailButton />
          </div>
          <ThemeToggle />
          <button ref={menuButton} type="button" className="hamburger"
            aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span />
          </button>
        </div>
      </div>
      <nav id="mobile-nav" className="mobile-menu" aria-label="Mobile navigation" hidden={!menuOpen}>
        {navigation.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <div className="mobile-menu__email-row">
          <a href={`mailto:${EMAIL}`} onClick={() => setMenuOpen(false)}>{EMAIL}</a>
          <CopyEmailButton />
        </div>
      </nav>
    </header>
  );
}
