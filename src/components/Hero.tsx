export function Hero() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden" style={{ background: "#6b3a0f" }}>
      {/* Background pattern */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/e31fc0e9-0bf3-4989-a5c0-c6130a95f770.png)`,
          backgroundRepeat: 'repeat',
          backgroundSize: '600px',
          opacity: 0.6,
        }}
      />
      {/* Main hero image */}
      <img
        src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/17fdaeff-2d44-4a72-a4b1-752e753651e8.png"
        alt="КИС — кап и сувель"
        className="absolute inset-0 w-full h-full object-contain object-top z-[1]"
      />

      {/* Dark gradient at bottom for readability */}
      <div
        className="absolute inset-x-0 bottom-0 z-[2]"
        style={{ height: '40%', background: 'linear-gradient(to top, rgba(50,20,0,0.9) 0%, rgba(50,20,0,0.4) 60%, transparent 100%)' }}
      />

      {/* Bottom content */}
      <div className="absolute bottom-10 md:bottom-10 left-0 right-0 z-[3] text-center px-6 flex flex-col items-center" style={{ bottom: 'clamp(3rem, 8vh, 5rem)' }}>
        <p className="text-white tracking-[0.2em] uppercase text-sm md:text-base mb-5 font-light">
          Интерьер начинается с деталей
        </p>
        <a
          href="#catalog"
          className="inline-block px-10 py-4 border border-white text-white text-sm tracking-widest uppercase hover:bg-white hover:text-[#8a5510] transition-all duration-300"
        >
          Смотреть каталог
        </a>
      </div>
    </section>
  )
}