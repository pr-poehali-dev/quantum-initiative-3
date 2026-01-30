interface Product {
  name?: string;
  description?: string;
  price?: number | null;
  in_stock?: boolean;
  display_order?: number;
  product_number?: string;
}

interface ProductEditFormProps {
  productId: number;
  editForm: Partial<Product> & { photos?: string[] };
  onFormChange: (form: Partial<Product>) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onImageClick?: (imageUrl: string) => void;
}

export function ProductEditForm({
  productId,
  editForm,
  onFormChange,
  onSave,
  onCancel,
  onImageClick,
}: ProductEditFormProps) {
  return (
    <div className="space-y-4">
      {editForm.photos && editForm.photos.length > 0 && (
        <div className="flex gap-3 flex-wrap mb-4">
          {editForm.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Фото ${index + 1}`}
              className="w-48 h-48 object-cover rounded-lg cursor-pointer hover:ring-4 hover:ring-primary/50 transition-all border-2 border-border"
              onClick={() => onImageClick?.(photo)}
              title="Нажмите, чтобы увеличить"
            />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Номер товара</label>
          <input
            type="text"
            value={editForm.product_number || ''}
            onChange={(e) => onFormChange({ ...editForm, product_number: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="например: 1, A-5, В-12"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Название</label>
          <input
            type="text"
            value={editForm.name || ''}
            onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Описание</label>
        <textarea
          value={editForm.description || ''}
          onChange={(e) => onFormChange({ ...editForm, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Цена (₽)</label>
        <input
          type="number"
          value={editForm.price || ''}
          onChange={(e) => onFormChange({ ...editForm, price: parseFloat(e.target.value) || null })}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Порядок отображения</label>
        <input
          type="number"
          value={editForm.display_order || 0}
          onChange={(e) => onFormChange({ ...editForm, display_order: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border rounded-md"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={editForm.in_stock || false}
          onChange={(e) => onFormChange({ ...editForm, in_stock: e.target.checked })}
          id={`edit-in-stock-${productId}`}
        />
        <label htmlFor={`edit-in-stock-${productId}`} className="text-sm">В наличии</label>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSave(productId)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Сохранить
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-muted"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}