import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AddProductForm } from '@/components/products/AddProductForm';
import { ProductEditForm } from '@/components/products/ProductEditForm';
import { ProductCard } from '@/components/products/ProductCard';

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
  product_number?: string;
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
    product_number: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [searchNumber, setSearchNumber] = useState('');
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

    if (loading) return;

    try {
      setLoading(true);
      
      let productNumber = newProduct.product_number;
      if (!productNumber) {
        const maxNumber = products.reduce((max, p) => {
          const num = parseInt(p.product_number || '0');
          return num > max ? num : max;
        }, 0);
        productNumber = String(maxNumber + 1);
      }
      
      const response = await fetch(PRODUCTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, product_number: productNumber }),
      });

      if (response.ok) {
        toast({
          title: 'Товар добавлен',
          description: `Новый товар #${productNumber} успешно создан`,
        });
        setNewProduct({
          name: '',
          description: '',
          price: null,
          in_stock: true,
          display_order: 0,
          product_number: '',
        });
        setShowAddForm(false);
        await loadProducts();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить товар',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
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
    const allPhotos = product.photos || [];
    if (product.photo_url && !allPhotos.includes(product.photo_url)) {
      allPhotos.unshift(product.photo_url);
    }
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      in_stock: product.in_stock,
      display_order: product.display_order,
      product_number: product.product_number || '',
      photos: allPhotos,
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

  const handleBulkPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    let successCount = 0;
    let errorCount = 0;

    setLoading(true);

    let maxNumber = products.reduce((max, p) => {
      const num = parseInt(p.product_number || '0');
      return num > max ? num : max;
    }, 0);

    for (const file of fileArray) {
      try {
        const compressedDataUrl = await compressImage(file);
        maxNumber++;
        
        const response = await fetch(PRODUCTS_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Ваза',
            description: '',
            price: null,
            in_stock: true,
            display_order: 0,
            product_number: String(maxNumber),
            photo_base64: compressedDataUrl,
          }),
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        errorCount++;
      }
    }

    setLoading(false);

    if (successCount > 0) {
      toast({
        title: 'Загрузка завершена',
        description: `Создано товаров: ${successCount}${errorCount > 0 ? `, ошибок: ${errorCount}` : ''}`,
      });
      loadProducts();
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фотографии',
        variant: 'destructive',
      });
    }

    e.target.value = '';
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  const filteredProducts = products.filter(product => {
    if (!searchNumber.trim()) return true;
    return product.product_number?.includes(searchNumber.trim());
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Управление каталогом</h2>
        <div className="flex gap-2">
          <label className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors cursor-pointer">
            Массовая загрузка фото
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkPhotoUpload}
              className="hidden"
            />
          </label>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {showAddForm ? 'Отмена' : 'Добавить товар'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Поиск по номеру:</label>
        <input
          type="text"
          placeholder="Введите номер изделия"
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          className="flex-1 max-w-xs px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchNumber && (
          <button
            onClick={() => setSearchNumber('')}
            className="px-3 py-2 text-sm bg-secondary rounded-md hover:bg-secondary/80"
          >
            Очистить
          </button>
        )}
      </div>

      {showAddForm && (
        <AddProductForm
          newProduct={newProduct}
          onFormChange={setNewProduct}
          onPhotoUpload={handlePhotoUpload}
          onSubmit={handleAddProduct}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchNumber ? 'Изделия с таким номером не найдены' : 'Нет товаров'}
          </div>
        ) : (
          filteredProducts.map((product, index) => (
          <div key={product.id}>
            {editingId === product.id ? (
              <div className="bg-card p-6 rounded-lg border">
                <ProductEditForm
                  productId={product.id}
                  editForm={editForm}
                  onFormChange={setEditForm}
                  onSave={saveEdit}
                  onCancel={() => {
                    setEditingId(null);
                    setEditForm({});
                  }}
                  onImageClick={setZoomedImage}
                />
              </div>
            ) : (
              <ProductCard
                product={product}
                index={index}
                onEdit={startEdit}
                onDelete={handleDelete}
                onPhotoUpload={handlePhotoUpload}
                onRemovePhoto={handleRemovePhoto}
              />
            )}
          </div>
          ))
        )}
      </div>

      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <img 
            src={zoomedImage} 
            alt="Увеличенное фото" 
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}