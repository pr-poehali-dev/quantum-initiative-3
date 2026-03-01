import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | null;
  photo_url: string | null;
  photos: string[];
  in_stock: boolean;
  display_order: number;
  product_number?: string;
  dimensions?: string | null;
}

interface ProductCardProps {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onPhotoUpload: (productId: number, file: File) => void;
  onRemovePhoto: (productId: number, photoUrl: string) => void;
}

export function ProductCard({
  product,
  index,
  onEdit,
  onDelete,
  onPhotoUpload,
  onRemovePhoto,
}: ProductCardProps) {
  return (
    <div className="bg-card p-6 rounded-lg border">
      <div className="flex gap-6">
        <div className="flex gap-2 flex-shrink-0 flex-wrap max-w-xs">
          {product.photos && product.photos.length > 0 ? (
            product.photos.map((photo, index) => (
              <div key={index} className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden group">
                <img src={photo} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => onRemovePhoto(product.id, photo)}
                  className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Удалить фото"
                >
                  <Icon name="X" size={14} />
                </button>
              </div>
            ))
          ) : product.photo_url ? (
            <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden group">
              <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemovePhoto(product.id, product.photo_url!)}
                className="absolute top-1 right-1 bg-destructive text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                title="Удалить фото"
              >
                <Icon name="X" size={14} />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
              <Icon name="Image" size={32} className="text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold">
                {product.product_number ? `№${product.product_number}` : `№${index + 1}`}. {product.name}
              </h3>
              {product.description && (
                <p className="text-muted-foreground mt-1">{product.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer px-3 py-1 border rounded-md hover:bg-muted transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onPhotoUpload(product.id, file);
                  }}
                />
                <Icon name="Upload" size={16} className="inline" />
              </label>
              <button
                onClick={() => onEdit(product)}
                className="px-3 py-1 border rounded-md hover:bg-muted transition-colors"
              >
                <Icon name="Edit" size={16} />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="px-3 py-1 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-white transition-colors"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            {product.price && (
              <span className="font-medium">{product.price.toLocaleString('ru-RU')} ₽</span>
            )}
            <span className={product.in_stock ? 'text-green-600' : 'text-red-600'}>
              {product.in_stock ? 'В наличии' : 'Продано'}
            </span>
            <span className="text-muted-foreground">Порядок: {product.display_order}</span>
          </div>
        </div>
      </div>
    </div>
  );
}