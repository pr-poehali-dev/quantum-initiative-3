interface Product {
  name?: string;
  description?: string;
  price?: number | null;
  in_stock?: boolean;
  display_order?: number;
}

interface ProductEditFormProps {
  productId: number;
  editForm: Partial<Product>;
  onFormChange: (form: Partial<Product>) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
}

export function ProductEditForm({
  productId,
  editForm,
  onFormChange,
  onSave,
  onCancel,
}: ProductEditFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Название</label>
        <input
          type="text"
          value={editForm.name || ''}
          onChange={(e) => onFormChange({ ...editForm, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-md"
        />
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
