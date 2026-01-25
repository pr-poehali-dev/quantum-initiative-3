export function Hero() {

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 z-10" />
        <img
          src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/daffdc58-392b-4689-8100-a42e99c34024.jpeg"
          alt="Деревянные изделия ручной работы"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-20 flex items-center min-h-screen">
        <div className="text-center w-full">
          <p className="text-sm tracking-[0.3em] uppercase text-white/80 mb-6">{"Студия декора из дерева"}</p>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-balance text-center text-white mb-8 tracking-tight leading-[0.95]">
            {"Тепло дерева"}
            <br />
            <span className="text-orange-200">{"в каждом изделии"}</span>
          </h1>
        </div>
      </div>
    </section>
  )
}