import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const MEDIA_API = 'https://functions.poehali.dev/bf44cf81-0850-473e-92c5-6da7b70c3c07';
const UPLOAD_API = 'https://functions.poehali.dev/34876a78-f76d-4862-8d89-f950c302216f';

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

export function useMediaManagement() {
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [mediaUrls, setMediaUrls] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Media>>({});
  const [previewFile, setPreviewFile] = useState<{ url: string; type: string; name: string } | null>(null);
  const { toast } = useToast();

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

  return {
    mediaList,
    mediaUrls,
    loading,
    uploading,
    editingId,
    editForm,
    previewFile,
    loadMedia,
    handleFileSelect,
    confirmUpload,
    cancelPreview,
    handleDelete,
    startEdit,
    cancelEdit,
    saveEdit,
    setEditForm,
    compressImage,
  };
}
