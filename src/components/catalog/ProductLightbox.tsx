import { useEffect } from "react"
import Icon from "@/components/ui/icon"

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
  dimensions?: string | null
}

interface ProductLightboxProps {
  isOpen: boolean
  currentProduct: Product
  currentPhotoIndex: number
  zoom: number
  position: { x: number; y: number }
  isDragging: boolean
  getAllProductPhotos: (product: Product) => string[]
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  onZoomIn: () => void
  onZoomOut: () => void
  onDoubleClick: () => void
  onWheel: (e: React.WheelEvent) => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onTouchStart: (e: React.TouchEvent) => void
  onTouchMove: (e: React.TouchEvent) => void
  onTouchEnd: () => void
}

export function ProductLightbox({
  isOpen,
  currentProduct,
  currentPhotoIndex,
  zoom,
  position,
  isDragging,
  getAllProductPhotos,
  onClose,
  onNext,
  onPrev,
  onZoomIn,
  onZoomOut,
  onDoubleClick,
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}: ProductLightboxProps) {
  if (!isOpen) return null

  const photos = getAllProductPhotos(currentProduct)
  const currentPhoto = photos[currentPhotoIndex]

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-muted transition-colors z-50"
        aria-label="Закрыть"
      >
        <Icon name="X" size={32} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-muted transition-colors z-50"
        aria-label="Предыдущее"
      >
        <Icon name="ChevronLeft" size={48} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
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
            onZoomOut()
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <Icon name="ZoomOut" size={24} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onZoomIn()
          }}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <Icon name="ZoomIn" size={24} />
        </button>
      </div>

      <div
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={onDoubleClick}
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
      >
        <img
          src={currentPhoto}
          alt={currentProduct.name}
          className="max-w-[90vw] max-h-[90vh] object-contain select-none pointer-events-none"
          style={{
            transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        />
      </div>

      <div className="absolute bottom-6 left-6 bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 z-50 max-w-md">
        <h3 className="text-white text-lg md:text-xl font-medium mb-1">
          {currentProduct.product_number ? `№${currentProduct.product_number}` : ''}. {currentProduct.name}
        </h3>
        {currentProduct.description && (
          <p className="text-white/70 text-sm mt-1">{currentProduct.description}</p>
        )}
        {currentProduct.price !== null && (
          <p className="text-white text-base md:text-lg font-medium mt-2">
            {currentProduct.price.toLocaleString('ru-RU')} ₽
          </p>
        )}
      </div>
    </div>
  )
}