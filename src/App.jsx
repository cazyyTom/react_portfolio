import { useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Projects from "./components/Projects";
import About from "./components/About";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  useEffect(() => {
    // Fragment links can arrive before React mounts the target section.
    const target = document.getElementById(window.location.hash.slice(1));
    target?.scrollIntoView({ behavior: "instant" });
  }, []);

  return (
    <ThemeProvider>
      <div className="app">
        <Header />
        <main>
          <Hero />
          <About />
          <Work />
          <Projects />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;
