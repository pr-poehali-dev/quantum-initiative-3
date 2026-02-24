import { useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const reviews = [
  {
    id: 1,
    name: "Алексей Морозов",
    city: "Москва",
    productNumber: "КП-001",
    productName: "Ваза из капа берёзы",
    rating: 5,
    text: "Просто невероятно! Стоит на столе и все гости сразу спрашивают, где купил. Живая вещь, тёплая — ни одна фабричная поделка рядом не стоит.",
    date: "январь 2025",
  },
  {
    id: 2,
    name: "Светлана Ковалёва",
    city: "Санкт-Петербург",
    productNumber: "СВ-003",
    productName: "Чаша из сувели дуба",
    rating: 5,
    text: "Брала в подарок мужу. Он у меня непростой человек в плане вкуса, но был очень доволен. Качество на высшем уровне, упаковано аккуратно.",
    date: "февраль 2025",
  },
  {
    id: 3,
    name: "Дмитрий Захаров",
    city: "Екатеринбург",
    productNumber: "КП-007",
    productName: "Шкатулка из капа ореха",
    rating: 4,
    text: "Хорошая работа. Рисунок дерева красивый, поверхность гладкая. Доставка заняла немного дольше, чем ожидал, но результат того стоил.",
    date: "декабрь 2024",
  },
  {
    id: 4,
    name: "Ирина Белова",
    city: "Казань",
    productNumber: "СВ-011",
    productName: "Столешница из сувели ясеня",
    rating: 5,
    text: "Боже мой, это шедевр! Такого узора я никогда в жизни не видела. Муж сначала скептически отнёсся к цене, а теперь сам всем показывает и хвастается.",
    date: "ноябрь 2024",
  },
  {
    id: 5,
    name: "Павел Григорьев",
    city: "Новосибирск",
    productNumber: "КП-014",
    productName: "Панно из капа вяза",
    rating: 4,
    text: "Заказывал впервые. Пришло в целости, всё аккуратно. Сама работа добротная, мастер явно знает своё дело. Буду заказывать ещё.",
    date: "октябрь 2024",
  },
  {
    id: 6,
    name: "Наталья Соколова",
    city: "Краснодар",
    productNumber: "СВ-019",
    productName: "Ваза из сувели клёна",
    rating: 5,
    text: "Купила себе на день рождения — решила не ждать, пока кто-то подарит. Ни капли не пожалела! Каждый день любуюсь, настроение поднимает.",
    date: "сентябрь 2024",
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
