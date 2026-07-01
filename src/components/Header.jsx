import { useState, useEffect } from "react";
import { useMagneticHover } from "../hooks/useMagneticHover";
import ThemeToggle from "./ThemeToggle";
import "./Header.css";

function NavLink({ href, children }) {
  const { ref, onMouseMove, onMouseLeave } = useMagneticHover(0.3);
  return (
    <a
      ref={ref}
      href={href}
      className="nav-link"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
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
          <a
            ref={ctaHover.ref}
            href="mailto:tomardevesh012@gmail.com"
            className="header__cta"
            onMouseMove={ctaHover.onMouseMove}
            onMouseLeave={ctaHover.onMouseLeave}
          >
            tomardevesh012@gmail.com
          </a>

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
        <a href="mailto:tomardevesh012@gmail.com" onClick={() => setMenuOpen(false)}>tomardevesh012@gmail.com</a>
      </div>
    </header>
  );
}
