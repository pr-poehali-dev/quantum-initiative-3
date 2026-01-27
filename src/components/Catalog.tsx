import { useEffect, useState } from "react"
import { HighlightedText } from "./HighlightedText"

const PRODUCTS_API = 'https://functions.poehali.dev/e1ea056e-4429-4a26-8b40-0a4a97dd94b1'

interface Product {
  id: number
  name: string
  description: string
  price: number | null
  photo_url: string | null
  in_stock: boolean
  display_order: number
  created_at: string | null
}

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(PRODUCTS_API)
        const data = await response.json()
        setProducts(Array.isArray(data) ? data.filter(p => p.in_stock) : [])
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  if (loading) {
    return (
      <section id="catalog" className="py-32 md:py-40">
        <div className="container mx-auto px-6 md:px-12">
          <p className="text-center text-muted-foreground">Загрузка...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="catalog" className="py-32 md:py-40 bg-muted/30">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-20">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">Наш каталог</p>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-medium leading-[1.15] tracking-tight text-balance">
            Изделия в <HighlightedText>наличии</HighlightedText>
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            В данный момент нет товаров в наличии
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-background mb-6">
                  {product.photo_url ? (
                    <img
                      src={product.photo_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-muted-foreground">Фото товара</p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-medium">{product.name}</h3>
                  {product.description && (
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  )}
                  {product.price !== null && (
                    <p className="text-2xl font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
