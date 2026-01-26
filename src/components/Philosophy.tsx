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
    title: "Профессиональные мастера",
    description:
      "Наши парикмахеры регулярно повышают квалификацию и следят за последними трендами. Ваши волосы в надёжных руках.",
  },
  {
    title: "Качественная косметика",
    description:
      "Используем только профессиональные средства для ухода за волосами. Каждый продукт подбирается индивидуально.",
  },
  {
    title: "Индивидуальный подход",
    description:
      "Мы слушаем ваши пожелания и предлагаем решения, которые подчеркнут вашу индивидуальность и стиль.",
  },
  {
    title: "Уютная атмосфера",
    description: "В нашем салоне вы почувствуете себя комфортно и расслабленно. Мы создали пространство для вашего отдыха и преображения.",
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
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">О нас</p>
            <h2 className="text-6xl md:text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-8xl">
              Красота с
              <br />
              <HighlightedText>заботой</HighlightedText>
            </h2>

            <div className="relative hidden lg:block">
              <img
                src="/images/exterior.png"
                alt="Интерьер салона красоты"
                className="opacity-90 relative z-10 w-auto"
              />
            </div>
          </div>

          {/* Right column - Description and Philosophy items */}
          <div className="space-y-6 lg:pt-48">
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-12">
              Ваши волосы — это ваша визитная карточка. Мы создаём образы, которые подчеркивают вашу уникальность и стиль.
            </p>

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