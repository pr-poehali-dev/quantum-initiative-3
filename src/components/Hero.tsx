export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Full screen background image */}
      <img
        src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/17fdaeff-2d44-4a72-a4b1-752e753651e8.png"
        alt="Изделие из капа"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-10 bg-black/30" />

      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen w-full px-6 text-center">

        {/* Logo letters */}
        <div className="mb-2">
          <span className="font-heading" style={{
            fontSize: "clamp(100px, 22vw, 220px)",
            lineHeight: 0.85,
            letterSpacing: "0.05em",
            background: "linear-gradient(160deg, #f5e090 10%, #c88030 50%, #8a5510 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            display: "block",
            fontStyle: "italic",
          }}>КИС</span>
        </div>

        {/* Divider line */}
        <div className="w-48 h-px bg-white/80 mb-4" />

        {/* Subtitle */}
        <p className="text-white tracking-[0.4em] uppercase text-sm md:text-base mb-1 font-light">
          кап и сувель
        </p>
        <p className="text-white/80 tracking-[0.3em] uppercase text-xs md:text-sm mb-10 font-light">
          дары природы
        </p>

        {/* Tagline */}
        <p className="text-white/90 tracking-[0.25em] uppercase text-sm md:text-base mb-8 font-light">
          Интерьер начинается с деталей
        </p>

        {/* CTA */}
        <a
          href="#catalog"
          className="inline-block px-10 py-4 border border-white/70 text-white text-sm tracking-widest uppercase hover:bg-white hover:text-[#8a5510] transition-all duration-300"
        >
          Смотреть каталог
        </a>
      </div>
    </section>
  )
}
