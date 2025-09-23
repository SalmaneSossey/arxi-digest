import { useState, useEffect } from "react";

const HeaderBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-smooth border-b ${
        isScrolled
          ? "bg-cloud-white/80 backdrop-blur-md border-sky-light shadow-soft"
          : "bg-cloud-white/50 border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-gradient">
            ScholarBrief
          </h1>
          <span className="text-sm text-text-secondary hidden sm:inline">
            Latest papers at a glance
          </span>
        </div>
        
        <nav>
          <button className="text-sm text-text-secondary hover:text-primary transition-smooth px-4 py-2 rounded-lg hover:bg-sky-light/50">
            About
          </button>
        </nav>
      </div>
    </header>
  );
};

export default HeaderBar;