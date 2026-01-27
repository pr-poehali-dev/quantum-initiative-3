interface Product {
  name?: string;
  description?: string;
  price?: number | null;
  in_stock?: boolean;
  display_order?: number;
  photo_base64?: string;
}

interface AddProductFormProps {
  newProduct: Partial<Product>;
  onFormChange: (product: Partial<Product>) => void;
  onPhotoUpload: (productId: number | null, file: File) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function AddProductForm({
  newProduct,
  onFormChange,
  onPhotoUpload,
  onSubmit,
  onCancel,
}: AddProductFormProps) {
  return (
    <div className="bg-card p-6 rounded-lg border space-y-4">
      <h3 className="text-xl font-bold">Новый товар</h3>
      
      <div>
        <label className="block text-sm font-medium mb-2">Название *</label>
        <input
          type="text"
          value={newProduct.name || ''}
          onChange={(e) => onFormChange({ ...newProduct, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="Деревянная шкатулка"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Описание</label>
        <textarea
          value={newProduct.description || ''}
          onChange={(e) => onFormChange({ ...newProduct, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          rows={3}
          placeholder="Краткое описание товара"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Цена (₽)</label>
        <input
          type="number"
          value={newProduct.price || ''}
          onChange={(e) => onFormChange({ ...newProduct, price: parseFloat(e.target.value) || null })}
          className="w-full px-4 py-2 border rounded-md"
          placeholder="2500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Фото</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onPhotoUpload(null, file);
          }}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={newProduct.in_stock || false}
          onChange={(e) => onFormChange({ ...newProduct, in_stock: e.target.checked })}
          id="new-in-stock"
        />
        <label htmlFor="new-in-stock" className="text-sm">В наличии</label>
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Создать товар
      </button>
    </div>
  );
}
