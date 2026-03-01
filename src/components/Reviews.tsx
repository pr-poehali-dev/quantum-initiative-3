import { useState, useEffect } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const REVIEWS_API = "https://functions.poehali.dev/9d4ffcf8-b375-406a-b80e-0fdf6eb75216"

interface Review {
  id: number
  name: string
  city: string
  product_number: string
  product_name: string
  rating: number
  text: string
  published: boolean
  created_at: string
}

const EMPTY_FORM = { name: "", city: "Красноярск", product_number: "", product_name: "", rating: 5, text: "" }

export function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [current, setCurrent] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(REVIEWS_API)
      .then((r) => r.json())
      .then((data) => {
        const parsed = typeof data === "string" ? JSON.parse(data) : data
        setReviews(Array.isArray(parsed) ? parsed : [])
      })
      .catch(() => setReviews([]))
  }, [])

  const perPage = 3
  const total = Math.ceil(reviews.length / perPage)
  const visible = reviews.slice(current * perPage, current * perPage + perPage)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) {
      setError("Заполните имя и текст отзыва")
      return
    }
    setSending(true)
    setError("")
    try {
      const res = await fetch(REVIEWS_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
        setForm(EMPTY_FORM)
        setShowForm(false)
      } else {
        setError("Не удалось отправить. Попробуйте ещё раз.")
      }
    } catch {
      setError("Ошибка соединения. Попробуйте ещё раз.")
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="reviews" className="py-20 bg-stone-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            <HighlightedText>Отзывы покупателей</HighlightedText>
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Мнения людей, которые уже живут с&nbsp;нашими изделиями
          </p>
        </div>

        {reviews.length > 0 ? (
          <>
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
                    {review.product_number && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-stone-400 font-mono bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5">
                          №{review.product_number}
                        </span>
                        <span className="text-xs text-stone-500 truncate">{review.product_name}</span>
                      </div>
                    )}
                    <div className="text-xs text-stone-400 mt-1">{formatDate(review.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>

            {total > 1 && (
              <div className="flex justify-center gap-2 mb-10">
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
          </>
        ) : (
          <p className="text-center text-stone-400 mb-10">Пока отзывов нет — будьте первым!</p>
        )}

        {sent ? (
          <div className="max-w-lg mx-auto text-center bg-green-50 border border-green-200 rounded-2xl p-8">
            <Icon name="CheckCircle" size={40} className="text-green-500 mx-auto mb-3" />
            <p className="text-green-700 font-medium text-lg">Спасибо за отзыв!</p>
            <p className="text-green-600 text-sm mt-1">Он появится после проверки</p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-sm text-stone-400 hover:text-stone-600 underline"
            >
              Написать ещё
            </button>
          </div>
        ) : !showForm ? (
          <div className="text-center">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors duration-300"
            >
              <Icon name="MessageSquarePlus" size={18} />
              Написать отзыв
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-primary mb-6">Ваш отзыв</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Ваше имя *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Иван Иванов"
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Город</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Оценка</label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, rating: s })}
                      >
                        <Icon
                          name="Star"
                          size={22}
                          className={s <= form.rating ? "text-amber-400 fill-amber-400" : "text-stone-300 fill-stone-300"}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Артикул товара</label>
                  <input
                    type="text"
                    value={form.product_number}
                    onChange={(e) => setForm({ ...form, product_number: e.target.value })}
                    placeholder="К9"
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Название товара</label>
                  <input
                    type="text"
                    value={form.product_name}
                    onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                    placeholder="Доска разделочная"
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Текст отзыва *</label>
                <textarea
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  placeholder="Поделитесь впечатлениями об изделии..."
                  rows={4}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {sending ? "Отправка..." : "Отправить"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError("") }}
                  className="px-6 py-3 border border-stone-200 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}