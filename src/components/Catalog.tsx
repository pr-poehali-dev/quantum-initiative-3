import { useEffect, useState } from "react"
import { HighlightedText } from "./HighlightedText"
import Icon from "@/components/ui/icon"
import { ProductCard } from "./catalog/ProductCard"
import { ProductLightbox } from "./catalog/ProductLightbox"
import { OrderForm } from "./catalog/OrderForm"

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
  product_number?: string
}

export function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [cardPhotoIndexes, setCardPhotoIndexes] = useState<{ [key: number]: number }>({})
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [orderFormOpen, setOrderFormOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<{ index: number; name: string; telegram: string; productNumber?: string } | null>(null)
  const [searchNumber, setSearchNumber] = useState('')

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
    setCurrentPhotoIndex(0)
    setLightboxOpen(true)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setCurrentPhotoIndex(0)
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const nextImage = () => {
    const currentPhotos = getAllProductPhotos(products[currentIndex])
    if (currentPhotoIndex < currentPhotos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    } else {
      setCurrentIndex((prev) => (prev + 1) % products.length)
      setCurrentPhotoIndex(0)
    }
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  const prevImage = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    } else {
      const newIndex = (currentIndex - 1 + products.length) % products.length
      const prevPhotos = getAllProductPhotos(products[newIndex])
      setCurrentIndex(newIndex)
      setCurrentPhotoIndex(prevPhotos.length - 1)
    }
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

  const getAllProductPhotos = (product: Product): string[] => {
    const photos = [...(product.photos || [])]
    if (product.photo_url && !photos.includes(product.photo_url)) {
      photos.unshift(product.photo_url)
    }
    return photos.filter(p => p)
  }

  const handleOrderClick = (index: number, name: string, telegram: string, productNumber?: string) => {
    setSelectedProduct({ index, name, telegram, productNumber })
    setOrderFormOpen(true)
  }

  const handleCardPhotoChange = (productId: number, direction: 'prev' | 'next') => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    
    const photos = getAllProductPhotos(product)
    const currentIdx = cardPhotoIndexes[productId] || 0
    
    if (direction === 'next') {
      setCardPhotoIndexes(prev => ({
        ...prev,
        [productId]: currentIdx < photos.length - 1 ? currentIdx + 1 : 0
      }))
    } else {
      setCardPhotoIndexes(prev => ({
        ...prev,
        [productId]: currentIdx > 0 ? currentIdx - 1 : photos.length - 1
      }))
    }
  }

  const submitOrder = async (data: {
    customerName: string
    contactMethod: string
    contactValue: string
    orderComment: string
    privacyAccepted: boolean
  }) => {
    if (!data.customerName.trim() || !data.contactValue.trim()) {
      alert('Пожалуйста, заполните все поля')
      return
    }
    if (!data.privacyAccepted) {
      alert('Необходимо согласие с политикой конфиденциальности')
      return
    }
    if (!selectedProduct) return

    try {
      const response = await fetch('https://functions.poehali.dev/46601224-1c9e-4c3e-bcf2-eeab2be771c3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_order',
          product_index: selectedProduct.index,
          product_name: selectedProduct.name,
          customer_name: data.customerName,
          customer_phone: data.contactMethod === 'phone' || data.contactMethod === 'telegram' ? data.contactValue : '',
          contact_method: data.contactMethod,
          contact_value: data.contactValue,
          comment: data.orderComment
        })
      })

      const result = await response.json()

      if (result.success) {
        alert('✅ ' + result.message)
      } else {
        alert('Ошибка при отправке заказа. Попробуйте позже.')
      }
    } catch (error) {
      alert('Ошибка при отправке заказа. Попробуйте позже.')
    }
    
    setOrderFormOpen(false)
    setSelectedProduct(null)
  }

  const filteredProducts = products.filter(product => {
    if (!searchNumber.trim()) return true
    return product.product_number === searchNumber.trim()
  })

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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 max-w-2xl">
          <div className="flex items-center gap-2 flex-1">
            <Icon name="Search" size={20} className="text-muted-foreground" />
            <input
              type="text"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              placeholder="Поиск по номеру изделия..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>
          {searchNumber && (
            <button
              onClick={() => setSearchNumber('')}
              className="px-4 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors border rounded-lg hover:bg-muted/50"
            >
              Сбросить
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              {searchNumber ? 'Изделие с таким номером не найдено' : 'В каталоге пока нет товаров'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                photoIndex={cardPhotoIndexes[product.id] || 0}
                onPhotoChange={handleCardPhotoChange}
                onImageClick={openLightbox}
                onOrderClick={handleOrderClick}
                getAllProductPhotos={getAllProductPhotos}
                getProductImage={getProductImage}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && products[currentIndex] && (
        <ProductLightbox
          isOpen={lightboxOpen}
          currentProduct={products[currentIndex]}
          currentPhotoIndex={currentPhotoIndex}
          zoom={zoom}
          position={position}
          isDragging={isDragging}
          getAllProductPhotos={getAllProductPhotos}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStartDrag}
          onTouchMove={handleTouchMoveDrag}
          onTouchEnd={handleTouchEndDrag}
        />
      )}

      <OrderForm
        isOpen={orderFormOpen}
        selectedProduct={selectedProduct}
        onClose={() => setOrderFormOpen(false)}
        onSubmit={submitOrder}
      />
    </section>
  )
}
