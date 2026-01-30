import { useEffect, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"

const PRODUCTS_API = 'https://functions.poehali.dev/e1ea056e-4429-4a26-8b40-0a4a97dd94b1'

interface Product {
  id: number
  name: string
  description: string
  price: number | null
  photo_url: string | null
  photos: string[]
  in_stock: boolean
  display_order: number
  created_at: string | null
}

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

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

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setLightboxOpen(true)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 3))
  
  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1)
      if (newZoom === 1) setPosition({ x: 0, y: 0 })
      return newZoom
    })
  }

  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1)
      setPosition({ x: 0, y: 0 })
    } else {
      setZoom(2)
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -0.2 : 0.2
    setZoom((prev) => {
      const newZoom = Math.min(Math.max(prev + delta, 1), 3)
      if (newZoom === 1) setPosition({ x: 0, y: 0 })
      return newZoom
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const handleMouseUp = () => setIsDragging(false)

  const handleTouchStartDrag = (e: React.TouchEvent) => {
    if (zoom <= 1) {
      setTouchStart(e.targetTouches[0].clientX)
      return
    }
    setIsDragging(true)
    setDragStart({
      x: e.targetTouches[0].clientX - position.x,
      y: e.targetTouches[0].clientY - position.y
    })
  }

  const handleTouchMoveDrag = (e: React.TouchEvent) => {
    if (zoom <= 1) {
      setTouchEnd(e.targetTouches[0].clientX)
      return
    }
    if (!isDragging) return
    setPosition({
      x: e.targetTouches[0].clientX - dragStart.x,
      y: e.targetTouches[0].clientY - dragStart.y
    })
  }

  const handleTouchEndDrag = () => {
    setIsDragging(false)
    if (zoom <= 1 && touchStart && touchEnd) {
      const distance = touchStart - touchEnd
      if (distance > 50) nextImage()
      if (distance < -50) prevImage()
      setTouchStart(0)
      setTouchEnd(0)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') nextImage()
      if (e.key === 'ArrowLeft') prevImage()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, currentIndex, products.length])

  const getProductImage = (product: Product) => {
    if (product.photos && product.photos.length > 0) return product.photos[0]
    return product.photo_url || ''
  }

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
        <div className="flex justify-end mb-6">
          <a
            href="/admin#catalog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group px-4 py-2 rounded-lg hover:bg-secondary/50"
          >
            <Icon name="Lock" size={16} />
            Админ-панель
          </a>
        </div>
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
            {products.map((product, index) => {
              const imageUrl = getProductImage(product)
              return (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-background mb-6">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-muted-foreground">Фото товара</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-medium">№{index + 1}. {product.name}</h3>
                    {product.description && (
                      <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    )}
                    {product.price !== null && (
                      <p className="text-2xl font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const message = `Здравствуйте! Хочу заказать №${index + 1}. ${product.name}`
                        window.open(`https://t.me/maksimkalabukhov?text=${encodeURIComponent(message)}`, '_blank')
                      }}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                      Заказать в Telegram
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {lightboxOpen && products[currentIndex] && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-muted transition-colors z-50"
            aria-label="Закрыть"
          >
            <Icon name="X" size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-muted transition-colors z-50"
            aria-label="Предыдущее"
          >
            <Icon name="ChevronLeft" size={48} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-muted transition-colors z-50"
            aria-label="Следующее"
          >
            <Icon name="ChevronRight" size={48} />
          </button>

          <div className="absolute bottom-6 right-6 flex gap-2 z-50">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomOut()
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              aria-label="Уменьшить"
            >
              <Icon name="ZoomOut" size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleZoomIn()
              }}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              aria-label="Увеличить"
            >
              <Icon name="ZoomIn" size={24} />
            </button>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 px-4 py-2 rounded-lg z-50">
            <p className="text-white text-sm">
              {currentIndex + 1} / {products.length}
            </p>
          </div>

          <div className="flex flex-col items-center max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            <div
              className="relative max-h-[70vh] mb-4 overflow-hidden"
              onDoubleClick={handleDoubleClick}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStartDrag}
              onTouchMove={handleTouchMoveDrag}
              onTouchEnd={handleTouchEndDrag}
              style={{ cursor: zoom > 1 ? 'move' : 'zoom-in' }}
            >
              <img
                src={getProductImage(products[currentIndex])}
                alt={products[currentIndex].name}
                className="max-w-full max-h-[70vh] object-contain select-none"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                draggable={false}
              />
            </div>
            <div className="w-full max-w-lg bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg">
              <h3 className="text-white text-lg md:text-xl font-medium">{products[currentIndex].name}</h3>
              {products[currentIndex].description && (
                <p className="text-white/70 text-sm mt-1">{products[currentIndex].description}</p>
              )}
              {products[currentIndex].price !== null && (
                <p className="text-white text-base md:text-lg font-medium mt-2">
                  {products[currentIndex].price.toLocaleString('ru-RU')} ₽
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}