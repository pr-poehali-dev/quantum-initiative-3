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

interface ProductCardProps {
  product: Product
  index: number
  photoIndex: number
  onPhotoChange: (productId: number, direction: 'prev' | 'next') => void
  onImageClick: (index: number) => void
  onOrderClick: (index: number, name: string, telegram: string, productNumber?: string) => void
  getAllProductPhotos: (product: Product) => string[]
  getProductImage: (product: Product) => string
}

export function ProductCard({
  product,
  index,
  photoIndex,
  onPhotoChange,
  onImageClick,
  onOrderClick,
  getAllProductPhotos,
  getProductImage
}: ProductCardProps) {
  const photos = getAllProductPhotos(product)
  const hasMultiplePhotos = photos.length > 1

  return (
    <div className={`bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative ${!product.in_stock ? 'opacity-70' : ''}`}>
      {!product.in_stock && (
        <div className="absolute top-3 left-3 z-20 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          Продано
        </div>
      )}
      <div
        className="relative aspect-[4/3] bg-muted cursor-pointer overflow-hidden group"
        onClick={() => onImageClick(index)}
      >
        {getProductImage(product) ? (
          <>
            <img
              src={photos[photoIndex] || getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {hasMultiplePhotos && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPhotoChange(product.id, 'prev')
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                >
                  <Icon name="ChevronLeft" size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPhotoChange(product.id, 'next')
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors z-10"
                >
                  <Icon name="ChevronRight" size={20} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
                  {getAllProductPhotos(product).map((_, photoIdx) => (
                    <div
                      key={photoIdx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        photoIdx === photoIndex
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
      <div className="space-y-3 p-4">
        <h3 className="text-xl md:text-2xl font-medium">
          {product.product_number ? `№${product.product_number}` : `№${index + 1}`}. {product.name}
        </h3>
        {product.dimensions && (
          <p className="text-sm text-muted-foreground tracking-wide">{product.dimensions}</p>
        )}
        {product.description && (
          <p className="text-muted-foreground leading-relaxed">{product.description}</p>
        )}
        {product.price !== null && (
          <p className="text-2xl font-medium">{product.price.toLocaleString('ru-RU')} ₽</p>
        )}
        {product.in_stock || product.name?.toLowerCase().includes('доска') ? (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOrderClick(index, product.name, 'ANDERSONKOV', product.product_number)
            }}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Заказать
          </button>
        ) : (
          <div className="w-full px-6 py-3 bg-muted text-muted-foreground rounded-md text-center font-medium">
            Продано
          </div>
        )}
      </div>
    </div>
  )
}