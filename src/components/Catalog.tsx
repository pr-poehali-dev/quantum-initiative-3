import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
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
  const [customerName, setCustomerName] = useState('')
  const [contactMethod, setContactMethod] = useState('telegram')
  const [contactValue, setContactValue] = useState('')
  const [orderComment, setOrderComment] = useState('')
  const [privacyAccepted, setPrivacyAccepted] = useState(false)
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

  const submitOrder = async () => {
    if (!customerName.trim() || !contactValue.trim()) {
      alert('Пожалуйста, заполните все поля')
      return
    }
    if (!privacyAccepted) {
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
          customer_name: customerName,
          customer_phone: contactMethod === 'phone' || contactMethod === 'telegram' ? contactValue : '',
          contact_method: contactMethod,
          contact_value: contactValue,
          comment: orderComment
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
    setCustomerName('')
    setContactValue('')
    setContactMethod('telegram')
    setOrderComment('')
    setPrivacyAccepted(false)
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
              placeholder="Поиск по номеру изделия"
              value={searchNumber}
              onChange={(e) => setSearchNumber(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
          </div>
          {searchNumber && (
            <button
              onClick={() => setSearchNumber('')}
              className="px-4 py-2 text-sm bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Очистить
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground text-lg">
            {searchNumber ? 'Изделия с таким номером не найдены' : 'В данный момент нет товаров в наличии'}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {filteredProducts.map((product, index) => {
              const imageUrl = getProductImage(product)
              return (
                <div
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-[3/4] overflow-hidden bg-background mb-6 relative">
                    {imageUrl ? (
                      <>
                        <img
                          src={getAllProductPhotos(product)[cardPhotoIndexes[product.id] || 0] || imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {getAllProductPhotos(product).length > 1 && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const photos = getAllProductPhotos(product)
                                const currentIdx = cardPhotoIndexes[product.id] || 0
                                setCardPhotoIndexes(prev => ({
                                  ...prev,
                                  [product.id]: currentIdx > 0 ? currentIdx - 1 : photos.length - 1
                                }))
                              }}
                              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                            >
                              <Icon name="ChevronLeft" size={20} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const photos = getAllProductPhotos(product)
                                const currentIdx = cardPhotoIndexes[product.id] || 0
                                setCardPhotoIndexes(prev => ({
                                  ...prev,
                                  [product.id]: currentIdx < photos.length - 1 ? currentIdx + 1 : 0
                                }))
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                            >
                              <Icon name="ChevronRight" size={20} />
                            </button>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                              {getAllProductPhotos(product).map((_, photoIndex) => (
                                <div
                                  key={photoIndex}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    photoIndex === (cardPhotoIndexes[product.id] || 0)
                                      ? 'bg-white'
                                      : 'bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-muted-foreground">Фото товара</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl md:text-2xl font-medium">
                      {product.product_number ? `№${product.product_number}` : `№${index + 1}`}. {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    )}
                    {product.price !== null && (
                      <p className="text-2xl font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOrderClick(index, product.name, 'ANDERSONKOV', product.product_number)
                      }}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                    >
                      Заказать
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
              Товар {currentIndex + 1} / {products.length} • Фото {currentPhotoIndex + 1} / {getAllProductPhotos(products[currentIndex]).length}
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
                src={getAllProductPhotos(products[currentIndex])[currentPhotoIndex]}
                alt={`${products[currentIndex].name} - фото ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-[70vh] object-contain select-none"
                style={{
                  transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out'
                }}
                draggable={false}
              />
            </div>
            <div className="w-full max-w-lg bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg">
              <h3 className="text-white text-lg md:text-xl font-medium">
                {products[currentIndex].product_number ? `№${products[currentIndex].product_number}` : `№${currentIndex + 1}`}. {products[currentIndex].name}
              </h3>
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

      {orderFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setOrderFormOpen(false)}
        >
          <div
            className="bg-background rounded-lg p-6 max-w-md w-full my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium">Оформление заказа</h3>
              <button
                onClick={() => setOrderFormOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            {selectedProduct && (
              <p className="text-muted-foreground mb-4 text-sm">
                {selectedProduct.productNumber ? `№${selectedProduct.productNumber}` : `№${selectedProduct.index + 1}`}. {selectedProduct.name}
              </p>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-2">Ваше имя</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Иван"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Как с вами связаться?</label>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setContactMethod('telegram')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      contactMethod === 'telegram' 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Icon name="MessageCircle" size={16} className="inline mr-1" />
                    Telegram
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod('phone')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      contactMethod === 'phone' 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Icon name="Phone" size={16} className="inline mr-1" />
                    Телефон
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod('email')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      contactMethod === 'email' 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Icon name="Mail" size={16} className="inline mr-1" />
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactMethod('other')}
                    className={`px-4 py-2 rounded-md border transition-colors ${
                      contactMethod === 'other' 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                  >
                    <Icon name="MessageSquare" size={16} className="inline mr-1" />
                    Другое
                  </button>
                </div>
                <input
                  type={contactMethod === 'email' ? 'email' : 'text'}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    contactMethod === 'telegram' ? '@username или +7 999 123-45-67' :
                    contactMethod === 'phone' ? '+7 999 123-45-67' :
                    contactMethod === 'email' ? 'example@mail.ru' :
                    'VK, WhatsApp, другой способ связи'
                  }
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Комментарий (необязательно)</label>
                <textarea
                  value={orderComment}
                  onChange={(e) => setOrderComment(e.target.value)}
                  placeholder="Пожелания по доставке, вопросы или другие детали..."
                  rows={2}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                />
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-md">
                <input
                  type="checkbox"
                  id="privacy-checkbox"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-1 w-6 h-6 md:w-4 md:h-4 accent-primary cursor-pointer flex-shrink-0"
                />
                <label htmlFor="privacy-checkbox" className="text-sm text-muted-foreground cursor-pointer">
                  Я согласен с{' '}
                  <a 
                    href="/privacy" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    политикой конфиденциальности
                  </a>
                  {' '}и даю согласие на обработку персональных данных
                </label>
              </div>

              <button
                onClick={submitOrder}
                disabled={!privacyAccepted}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить заказ
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}