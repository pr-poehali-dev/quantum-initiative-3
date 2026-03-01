import { useEffect, useRef, useState } from "react"
import { HighlightedText } from "./HighlightedText"

const MASTERS_API = 'https://functions.poehali.dev/fff54d0d-ca89-4a7c-b0c6-163121618042'

interface Master {
  id: number
  name: string
  description: string
  photo_url: string | null
  display_order: number
}

const philosophyItems = [
  {
    title: "Натуральность материала",
    description:
      "Каждое изделие сохраняет естественную красоту дерева. Мы подчеркиваем уникальный рисунок, текстуру и\u00A0тепло натурального материала.",
  },
  {
    title: "Ручная работа",
    description:
      "Каждый элемент декора создается вручную с\u00A0вниманием к\u00A0деталям. Наши мастера вкладывают душу в\u00A0каждое изделие, делая его особенным.",
  },
  {
    title: "Уникальность каждого предмета",
    description:
      "Двух одинаковых изделий не\u00A0существует. Каждый элемент декора имеет свою историю и\u00A0характер, подчеркивая индивидуальность вашего пространства.",
  },
  {
    title: "Экологичность и долговечность",
    description: "Мы используем только качественные породы дерева и\u00A0экологичные покрытия. Наши изделия служат десятилетиями, сохраняя свою красоту и\u00A0качество.",
  },
]

export function Philosophy() {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [masters, setMasters] = useState<Master[]>([])

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const response = await fetch(MASTERS_API)
        const data = await response.json()
        setMasters(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load masters:', error)
      }
    }
    loadMasters()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"))
          if (entry.isIntersecting) {
            setVisibleItems((prev) => [...new Set([...prev, index])])
          }
        })
      },
      { threshold: 0.3 },
    )

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="py-32 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left column - Title and image */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наша философия</p>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              Ремесло
              <br />
              с <HighlightedText>душой</HighlightedText>
            </h2>

            <div className="relative mt-8 lg:mt-0">
              <img
                src="https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/11b7dd00-3d28-4bd4-9313-c4fc415dddb9.png"
                alt="Деревянные изделия на мраморном столе"
                className="opacity-90 relative z-10 w-full lg:w-auto rounded-lg"
              />
            </div>
          </div>

          {/* Right column - Description and Philosophy items */}
          <div className="space-y-6 lg:pt-48">
            <div className="space-y-6 mb-16">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Мы — небольшой магазинчик на\u00A0просторах интернета, продающий эксклюзивные украшения для\u00A0интерьера. Наш главный продукт выделяется из\u00A0общей массы сувениров, благодаря своей индивидуальности и\u00A0экологичности.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Фотографии не\u00A0могут в\u00A0полном объеме передать эмоции которые возникают при\u00A0прикосновении к\u00A0этому чуду. Ждем покупателей, которые предпочитают натуральные природные материалы в\u00A0интерьере, которые способны оценить труд мастера, ведь в\u00A0каждом изделии тепло его рук.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Мы хотим передать чувство волнения и\u00A0тайны рождения каждого изделия, ведь приступая к\u00A0работе мастер сам не\u00A0подозревает какая ему откроется красота. Так хочется показать ее людям, ведь как известно — «красота спасет мир».
              </p>
            </div>

            {philosophyItems.map((item, index) => (
              <div
                key={item.title}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                data-index={index}
                className={`transition-all duration-700 ${
                  visibleItems.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex gap-6">
                  <span className="text-muted-foreground/50 text-sm font-medium">0{index + 1}</span>
                  <div>
                    <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Masters section */}
            {masters.length > 0 && (
              <div className="mt-24 pt-16 border-t">
                <h3 className="text-3xl md:text-4xl font-medium mb-12">Наши мастера</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {masters.map((master) => (
                    <div key={master.id} className="space-y-4">
                      <div className="aspect-[3/4] overflow-hidden bg-muted">
                        {master.photo_url ? (
                          <img
                            src={master.photo_url}
                            alt={master.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-muted-foreground">Фото мастера</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-2">{master.name}</h4>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {master.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}