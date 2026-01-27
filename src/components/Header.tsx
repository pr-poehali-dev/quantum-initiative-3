import { useState, useEffect, MouseEvent } from "react"
import { cn } from "../lib/utils"
import Icon from "./ui/icon"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const scrollToTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header
      className={cn(
        "fixed z-50 transition-all duration-500 w-full",
        scrolled || mobileMenuOpen
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-transparent",
      )}
    >
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 group" onClick={scrollToTop}>
          <img 
            src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/9f79e38c-7906-48ed-bc3f-8d89d21c19af.png" 
            alt="Natural Masterpieces" 
            className="h-14 w-auto transition-transform group-hover:scale-105"
          />
        </a>

        <ul className="hidden md:flex items-center gap-10 text-sm tracking-wide">
          {[
            { label: "Главная", href: "#hero" },
            { label: "Философия", href: "#about" },
            { label: "Каталог", href: "#catalog" },
            { label: "Проекты", href: "#projects" },
          ].map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="hover:text-[rgb(251,146,60)] transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 hover:after:w-full after:bg-[rgb(251,146,60)] after:transition-all after:duration-300 text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://t.me/AndersonKov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-[rgb(251,146,60)] transition-colors duration-300"
            aria-label="Telegram"
          >
            <Icon name="Send" size={20} />
          </a>
          <a
            href="tel:+79293090898"
            className="text-white hover:text-[rgb(251,146,60)] transition-colors duration-300"
            aria-label="Позвонить"
          >
            <Icon name="Phone" size={20} />
          </a>
        </div>

        <button
          className="md:hidden z-50 p-2 transition-colors duration-300 text-white hover:text-[rgb(251,146,60)]"
          aria-label={mobileMenuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-primary/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-6">
            <ul className="flex flex-col gap-4 mb-6">
              {[
                { label: "Главная", href: "#hero" },
                { label: "Философия", href: "#about" },
                { label: "Каталог", href: "#catalog" },
                { label: "Проекты", href: "#projects" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="block py-3 text-white text-lg font-medium hover:text-[rgb(251,146,60)] transition-colors duration-300"
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-6 pt-4 border-t border-white/10">
              <a
                href="https://t.me/AndersonKov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-[rgb(251,146,60)] transition-colors duration-300"
                onClick={closeMobileMenu}
              >
                <Icon name="Send" size={20} />
                <span>Telegram</span>
              </a>
              <a
                href="tel:+79293090898"
                className="flex items-center gap-2 text-white hover:text-[rgb(251,146,60)] transition-colors duration-300"
                onClick={closeMobileMenu}
              >
                <Icon name="Phone" size={20} />
                <span>Позвонить</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}