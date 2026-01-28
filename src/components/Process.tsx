export function Process() {
  const steps = [
    {
      title: "Поиск капа в лесу",
      description: "Каждое изделие начинается с поиска уникального капа берёзы. Это редкое природное образование с неповторимым рисунком.",
      image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/e8b9d191-1f76-417c-b881-6c28625424c9.jpg"
    },
    {
      title: "Обработка заготовки",
      description: "Срезанный кап проходит первичную обработку. Удаляется кора, заготовка высушивается и готовится к работе.",
      image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/810e8573-9923-4649-a9b5-bcdcf02f3dfd.jpg"
    },
    {
      title: "Готовое изделие",
      description: "Ручная обработка подручными инструментами, шлифовка и покрытие маслом превращают заготовку в уникальную вазу. Каждый узор — дар природы.",
      image: "https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/4e3f05c9-da0e-4bec-b1ba-6ba2f8b69419.jpg"
    }
  ];

  return (
    <section id="process" className="py-24 px-6 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            От природы к искусству
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            История создания вазы из капа берёзы — от дерева в лесу до готового шедевра
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative overflow-hidden rounded-2xl aspect-[3/4] mb-6 shadow-xl">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/3 -right-4 w-8 h-8 text-primary/30">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14m-7-7l7 7-7 7"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}