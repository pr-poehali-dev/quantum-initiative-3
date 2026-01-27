import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ProductsAdmin } from '@/components/ProductsAdmin';
import { LoginForm } from '@/components/admin/LoginForm';
import { FileUploader } from '@/components/admin/FileUploader';
import { MediaGallery } from '@/components/admin/MediaGallery';
import { MastersManager } from '@/components/admin/MastersManager';

const AUTH_API = 'https://functions.poehali.dev/f56c2e7f-63c4-483a-a94d-9ea7c0a4ee6c';
const MEDIA_API = 'https://functions.poehali.dev/bf44cf81-0850-473e-92c5-6da7b70c3c07';
const UPLOAD_API = 'https://functions.poehali.dev/34876a78-f76d-4862-8d89-f950c302216f';
const MASTERS_API = 'https://functions.poehali.dev/fff54d0d-ca89-4a7c-b0c6-163121618042';

interface Media {
  id: number;
  url?: string;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  category: string;
  location: string;
  year: string;
  created_at: string;
}

interface Master {
  id: number;
  name: string;
  description: string;
  photo_url: string | null;
  display_order: number;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Media>>({});
  const [previewFile, setPreviewFile] = useState<{ url: string; type: string; name: string } | null>(null);
  const [masters, setMasters] = useState<Master[]>([]);
  const [editingMasterId, setEditingMasterId] = useState<number | null>(null);
  const [masterForm, setMasterForm] = useState<Partial<Master>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = sessionStorage.getItem('admin_token');
    const expiresAt = sessionStorage.getItem('admin_expires');
    
    if (token && expiresAt) {
      const expiry = new Date(expiresAt);
      if (new Date() < expiry) {
        setIsAuthenticated(true);
        loadMedia();
        loadMasters();
      } else {
        sessionStorage.removeItem('admin_token');
        sessionStorage.removeItem('admin_expires');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(AUTH_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        sessionStorage.setItem('admin_token', data.token);
        sessionStorage.setItem('admin_expires', data.expires_at);
        setIsAuthenticated(true);
        loadMedia();
        loadMasters();
        toast({
          title: 'Вход выполнен',
          description: 'Добро пожаловать в панель управления',
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить вход',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_expires');
    navigate('/');
  };

  const loadMasters = async () => {
    try {
      const response = await fetch(MASTERS_API);
      const data = await response.json();
      setMasters(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load masters:', error);
    }
  };

  const startEditMaster = (master: Master) => {
    setEditingMasterId(master.id);
    setMasterForm({
      name: master.name,
      description: master.description,
      photo_url: master.photo_url,
    });
  };

  const cancelEditMaster = () => {
    setEditingMasterId(null);
    setMasterForm({});
  };

  const saveMaster = async (id: number) => {
    try {
      const response = await fetch(MASTERS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...masterForm }),
      });

      if (response.ok) {
        toast({
          title: 'Сохранено',
          description: 'Данные мастера обновлены',
        });
        setEditingMasterId(null);
        setMasterForm({});
        loadMasters();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    }
  };

  const handleMasterPhotoUpload = async (masterId: number, file: File) => {
    try {
      const compressedDataUrl = await compressImage(file);
      
      const uploadResponse = await fetch(UPLOAD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: compressedDataUrl,
          type: 'image/jpeg',
        }),
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        
        const updateResponse = await fetch(MASTERS_API, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: masterId,
            photo_url: uploadData.url,
          }),
        });

        if (updateResponse.ok) {
          toast({
            title: 'Фото загружено',
            description: 'Фотография мастера обновлена',
          });
          loadMasters();
        }
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить фото',
        variant: 'destructive',
      });
    }
  };

  const loadMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${MEDIA_API}?limit=20`);
      const data = await response.json();
      const items = data.items || (Array.isArray(data) ? data : []);
      setMediaList(items);
      
      items.forEach(async (media: Media) => {
        loadMediaUrl(media.id);
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить медиа',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMediaUrl = async (id: number) => {
    try {
      const response = await fetch(`${MEDIA_API}?id=${id}`);
      const data = await response.json();
      if (data.url) {
        setMediaUrls(prev => ({ ...prev, [id]: data.url }));
      }
    } catch (error) {
      console.error(`Failed to load url for media ${id}:`, error);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Файл слишком большой',
        description: 'Максимальный размер: 50 МБ',
        variant: 'destructive',
      });
      return;
    }

    const mediaType = file.type.startsWith('video/') ? 'video' : 'image';
    
    if (mediaType === 'image') {
      try {
        const compressedDataUrl = await compressImage(file);
        setPreviewFile({
          url: compressedDataUrl,
          type: mediaType,
          name: file.name,
        });
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось обработать изображение',
          variant: 'destructive',
        });
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPreviewFile({
          url: dataUrl,
          type: mediaType,
          name: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
    
    e.target.value = '';
  };

  const confirmUpload = async () => {
    if (!previewFile) return;

    setUploading(true);

    try {
      const uploadResponse = await fetch(UPLOAD_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: previewFile.url,
          type: previewFile.type === 'video' ? 'video/mp4' : 'image/jpeg',
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error('Ошибка загрузки файла в хранилище');
      }

      const uploadData = await uploadResponse.json();
      const fileUrl = uploadData.url;

      const addResponse = await fetch(MEDIA_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: fileUrl,
          title: '',
          description: '',
          media_type: previewFile.type,
          category: '',
          location: '',
          year: '',
        }),
      });

      if (addResponse.ok) {
        toast({
          title: 'Файл загружен',
          description: 'Медиа успешно добавлено в галерею',
        });
        setPreviewFile(null);
        loadMedia();
      } else {
        const errorData = await addResponse.json().catch(() => ({}));
        throw new Error(errorData.error || 'Ошибка сохранения в базу');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Ошибка загрузки',
        description: error instanceof Error ? error.message : 'Не удалось загрузить файл',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const cancelPreview = () => {
    setPreviewFile(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить этот элемент?')) return;

    try {
      const response = await fetch(`${MEDIA_API}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Элемент удален',
          description: 'Медиа успешно удалено из галереи',
        });
        loadMedia();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить элемент',
        variant: 'destructive',
      });
    }
  };

  const startEdit = (media: Media) => {
    setEditingId(media.id);
    setEditForm({
      title: media.title,
      description: media.description,
      category: media.category,
      location: media.location,
      year: media.year,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: number) => {
    try {
      const response = await fetch(`${MEDIA_API}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast({
          title: 'Изменения сохранены',
          description: 'Данные успешно обновлены',
        });
        setEditingId(null);
        setEditForm({});
        loadMedia();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить изменения',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginForm
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Управление галереей</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border rounded-md hover:bg-muted transition-colors"
            >
              На сайт
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>

        <FileUploader
          previewFile={previewFile}
          uploading={uploading}
          onFileSelect={handleFileSelect}
          onConfirmUpload={confirmUpload}
          onCancelPreview={cancelPreview}
        />

        <MediaGallery
          mediaList={mediaList}
          mediaUrls={mediaUrls}
          loading={loading}
          editingId={editingId}
          editForm={editForm}
          onRefresh={loadMedia}
          onEdit={startEdit}
          onCancelEdit={cancelEdit}
          onSaveEdit={saveEdit}
          onDelete={handleDelete}
          onEditFormChange={setEditForm}
        />

        <div className="mt-8">
          <MastersManager
            masters={masters}
            editingMasterId={editingMasterId}
            masterForm={masterForm}
            onEdit={startEditMaster}
            onCancelEdit={cancelEditMaster}
            onSave={saveMaster}
            onPhotoUpload={handleMasterPhotoUpload}
            onFormChange={setMasterForm}
          />
        </div>

        <div className="mt-8">
          <ProductsAdmin />
        </div>
      </div>
    </div>
  );
}
