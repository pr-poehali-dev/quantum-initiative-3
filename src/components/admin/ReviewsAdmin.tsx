import { useState, useEffect } from "react"
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

export function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    fetch(`${REVIEWS_API}?admin=1`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const toggle = async (review: Review) => {
    await fetch(REVIEWS_API, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, published: !review.published }),
    })
    load()
  }

  const remove = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return
    await fetch(REVIEWS_API, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    load()
  }

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("ru-RU")

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Отзывы покупателей</h2>
        <button onClick={load} className="p-2 hover:bg-muted rounded-md transition-colors">
          <Icon name="RefreshCw" size={18} />
        </button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Загрузка...</p>
      ) : reviews.length === 0 ? (
        <p className="text-muted-foreground text-sm">Отзывов пока нет</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`border rounded-xl p-5 flex flex-col gap-3 ${r.published ? "border-green-200 bg-green-50/30" : "border-stone-200 bg-white"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{r.name}</span>
                    <span className="text-stone-400 text-xs">{r.city}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon
                          key={i}
                          name="Star"
                          size={12}
                          className={i < r.rating ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}
                        />
                      ))}
                    </div>
                  </div>
                  {r.product_number && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-xs font-mono bg-stone-100 border border-stone-200 rounded px-1.5 py-0.5">
                        №{r.product_number}
                      </span>
                      <span className="text-xs text-stone-500">{r.product_name}</span>
                    </div>
                  )}
                  <p className="text-sm text-stone-700">"{r.text}"</p>
                  <p className="text-xs text-stone-400 mt-2">{formatDate(r.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggle(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      r.published
                        ? "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {r.published ? "Скрыть" : "Опубликовать"}
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
