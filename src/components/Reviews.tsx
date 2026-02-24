import { useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const reviews = [
  {
    id: 1,
    name: "Марина Степанова",
    city: "Красноярск",
    productNumber: "К9",
    productName: "Доска разделочная (лиственница)",
    rating: 5,
    text: "Красота! Подруги завидуют. Лиственница пахнет потрясающе, доска тяжёлая, основательная. Каждый раз приятно готовить.",
    date: "февраль 2025",
  },
  {
    id: 2,
    name: "Олег Тихонов",
    city: "Красноярск",
    productNumber: "К6",
    productName: "Доска разделочная (бук)",
    rating: 5,
    text: "Брал на кухню — не пожалел. Добротная вещь, рисунок торца очень необычный. Жена в восторге, говорит жалко использовать по назначению.",
    date: "январь 2025",
  },
  {
    id: 3,
    name: "Татьяна Власова",
    city: "Красноярск",
    productNumber: "К7",
    productName: "Доска разделочная (лиственница)",
    rating: 4,
    text: "Хорошая работа. Качество нормальное, всё ровно, запах приятный. Чуть меньше по размеру, чем ожидала, но в целом довольна.",
    date: "январь 2025",
  },
  {
    id: 4,
    name: "Андрей Кузнецов",
    city: "Красноярск",
    productNumber: "К4",
    productName: "Доска разделочная (яблоня)",
    rating: 5,
    text: "Яблоня — это что-то особенное. Узор как картина. Подарил родителям, они были очень тронуты. Настоящий подарок с душой.",
    date: "декабрь 2024",
  },
  {
    id: 5,
    name: "Елена Фомина",
    city: "Красноярск",
    productNumber: "К3",
    productName: "Ваза (сувель берёзовый)",
    rating: 5,
    text: "Невероятно! Живой узор, никакая фотография не передаёт. Стоит на видном месте, все спрашивают откуда. Очень рада покупке!",
    date: "ноябрь 2024",
  },
  {
    id: 6,
    name: "Виктор Романов",
    city: "Красноярск",
    productNumber: "288",
    productName: "Ваза (пара), кап берёзы",
    rating: 4,
    text: "Пара ваз смотрится очень достойно. Материал качественный, видно что работа ручная. Подарил на юбилей — именинница осталась довольна.",
    date: "октябрь 2024",
  },
]

export function Reviews() {
  const [current, setCurrent] = useState(0)
  const perPage = 3

  const total = Math.ceil(reviews.length / perPage)
  const visible = reviews.slice(current * perPage, current * perPage + perPage)

  return (
    <section id="reviews" className="py-20 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            <HighlightedText>Отзывы покупателей</HighlightedText>
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Мнения людей, которые уже живут с нашими изделиями
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {visible.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex flex-col gap-4"
            >
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={16}
                    className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}
                  />
                ))}
              </div>

              <p className="text-stone-700 text-sm leading-relaxed flex-1">"{review.text}"</p>

              <div className="border-t border-stone-100 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary text-sm">{review.name}</span>
                  <span className="text-stone-400 text-xs">{review.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-stone-400 font-mono bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5">
                    №{review.productNumber}
                  </span>
                  <span className="text-xs text-stone-500 truncate">{review.productName}</span>
                </div>
                <div className="text-xs text-stone-400 mt-1">{review.date}</div>
              </div>
            </div>
          ))}
        </div>

        {total > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === current ? "bg-primary w-6" : "bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}