import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const PRODUCTS_API = 'https://functions.poehali.dev/e1ea056e-4429-4a26-8b40-0a4a97dd94b1';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | null;
  photo_url: string | null;
  photos: string[];
  in_stock: boolean;
  display_order: number;
}

export function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: null,
    in_stock: true,
    display_order: 0,
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(PRODUCTS_API);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить товары',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 1920;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (productId: number | null, file: File) => {
    try {
      const compressedDataUrl = await compressImage(file);
      
      if (productId) {
        const response = await fetch(PRODUCTS_API, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: productId,
            photo_base64: compressedDataUrl,
          }),
        });

        if (response.ok) {
          toast({
            title: 'Фото обновлено',
            description: 'Фотография товара загружена',
          });
          loadProducts();
        }
      } else {
        setNewProduct(prev => ({ ...prev, photo_base64: compressedDataUrl }));
        toast({
          title: 'Фото выбрано',
          description: 'Фото будет загружено при сохранении товара',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name) {
      toast({
        title: 'Ошибка',
        description: 'Укажите название товара',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(PRODUCTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (response.ok) {
        toast({
          title: 'Товар добавлен',
          description: 'Новый товар успешно создан',
        });
        setNewProduct({
          name: '',
          description: '',
          price: null,
          in_stock: true,
          display_order: 0,
        });
        setShowAddForm(false);
        loadProducts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот товар?')) return;

    try {
      const response = await fetch(PRODUCTS_API, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast({
          title: 'Товар удален',
          description: 'Товар успешно удален',
        });
        loadProducts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить товар',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      in_stock: product.in_stock,
      display_order: product.display_order,
    });
  };

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch(PRODUCTS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editForm }),
      });

      if (response.ok) {
        toast({
          title: 'Изменения сохранены',
          description: 'Данные товара обновлены',
        });
        setEditingId(null);
        setEditForm({});
        loadProducts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePhoto = async (productId: number, photoUrl: string) => {
    if (!confirm('Удалить это фото?')) return;

    try {
      const response = await fetch(PRODUCTS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: productId, 
          remove_photo: photoUrl 
        }),
      });

      if (response.ok) {
        toast({
          title: 'Фото удалено',
          description: 'Фотография успешно удалена',
        });
        loadProducts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить фото',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление каталогом</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          {showAddForm ? 'Отмена' : 'Добавить товар'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-card p-6 rounded-lg border space-y-4">
          <h3 className="text-xl font-bold">Новый товар</h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">Название *</label>
            <input
              type="text"
              value={newProduct.name || ''}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Деревянная шкатулка"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Описание</label>
            <textarea
              value={newProduct.description || ''}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
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
              onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || null })}
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
                if (file) handlePhotoUpload(null, file);
              }}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newProduct.in_stock || false}
              onChange={(e) => setNewProduct({ ...newProduct, in_stock: e.target.checked })}
              id="new-in-stock"
            />
            <label htmlFor="new-in-stock" className="text-sm">В наличии</label>
          </div>

          <button
            onClick={handleAddProduct}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Создать товар
          </button>
        </div>
      )}

      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-card p-6 rounded-lg border">
            {editingId === product.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название</label>
                  <input
                    type="text"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Описание</label>
                  <textarea
                    value={editForm.description || ''}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Цена (₽)</label>
                  <input
                    type="number"
                    value={editForm.price || ''}
                    onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || null })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Порядок отображения</label>
                  <input
                    type="number"
                    value={editForm.display_order || 0}
                    onChange={(e) => setEditForm({ ...editForm, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.in_stock || false}
                    onChange={(e) => setEditForm({ ...editForm, in_stock: e.target.checked })}
                    id={`edit-in-stock-${product.id}`}
                  />
                  <label htmlFor={`edit-in-stock-${product.id}`} className="text-sm">В наличии</label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(product.id)}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-muted"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-6">
                <div className="flex gap-2 flex-shrink-0 flex-wrap max-w-xs">
                  {product.photos && product.photos.length > 0 ? (
                    product.photos.map((photo, index) => (
                      <div key={index} className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden group">
                        <img src={photo} alt={`${product.name} - ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemovePhoto(product.id, photo)}
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
                        onClick={() => handleRemovePhoto(product.id, product.photo_url!)}
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
                      <h3 className="text-xl font-bold">{product.name}</h3>
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
                            if (file) handlePhotoUpload(product.id, file);
                          }}
                        />
                        <Icon name="Upload" size={16} className="inline" />
                      </label>
                      <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-1 border rounded-md hover:bg-muted transition-colors"
                      >
                        <Icon name="Edit" size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-white transition-colors"
                      >
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
                    {product.price !== null && (
                      <span className="font-medium text-foreground text-lg">{product.price.toLocaleString('ru-RU')} ₽</span>
                    )}
                    <span className={product.in_stock ? 'text-green-600' : 'text-red-600'}>
                      {product.in_stock ? '✓ В наличии' : '✗ Нет в наличии'}
                    </span>
                    <span>Порядок: {product.display_order}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Товаров пока нет. Добавьте первый товар в каталог.
          </div>
        )}
      </div>
    </div>
  );
}