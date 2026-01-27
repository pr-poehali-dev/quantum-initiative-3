import { useState } from 'react'
import Icon from './ui/icon'

interface ProductCarouselProps {
  photos: string[]
  productName: string
}

export function ProductCarousel({ photos, productName }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted">
        <p className="text-muted-foreground">Фото товара</p>
      </div>
    )
  }

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
  }

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative w-full h-full group">
      <img
        src={photos[currentIndex]}
        alt={`${productName} - фото ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {photos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Предыдущее фото"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Следующее фото"
          >
            <Icon name="ChevronRight" size={20} />
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-white w-6'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Перейти к фото ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
