export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#c8a84b]">
      {/* Gold gradient background */}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse at 30% 20%, #f0d060 0%, #c8a030 40%, #a07018 75%, #6a4a10 100%)"
      }} />

      {/* Subtle sheen overlay */}
      <div className="absolute inset-0 z-0 opacity-40" style={{
        background: "radial-gradient(ellipse at 70% 30%, rgba(255,255,200,0.5) 0%, transparent 60%)"
      }} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full px-6 text-center">

        {/* Logo letters */}
        <div className="mb-2">
          <span className="font-heading" style={{
            fontSize: "clamp(100px, 22vw, 220px)",
            lineHeight: 0.85,
            letterSpacing: "0.05em",
            color: "transparent",
            WebkitTextStroke: "2px rgba(180,120,40,0.7)",
            textShadow: "2px 4px 16px rgba(100,60,0,0.3)",
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
        <p className="text-white/80 tracking-[0.3em] uppercase text-xs md:text-sm mb-6 font-light">
          дары природы
        </p>

        {/* Product image */}
        <div className="mb-8 w-full max-w-sm md:max-w-md">
          <img
            src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/17fdaeff-2d44-4a72-a4b1-752e753651e8.png"
            alt="Изделие из капа"
            className="w-full object-contain drop-shadow-2xl"
            style={{ maxHeight: "340px" }}
          />
        </div>

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
