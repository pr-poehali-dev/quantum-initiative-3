import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const AUTH_API = 'https://functions.poehali.dev/f56c2e7f-63c4-483a-a94d-9ea7c0a4ee6c';
const MEDIA_API = 'https://functions.poehali.dev/bf44cf81-0850-473e-92c5-6da7b70c3c07';
const UPLOAD_API = 'https://functions.poehali.dev/79ec0224-ad03-4786-a0d7-bea6e8ce3d08';

interface Media {
  id: number;
  url: string;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  category: string;
  location: string;
  year: string;
  created_at: string;
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mediaList, setMediaList] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Media>>({});
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

  const loadMedia = async () => {
    setLoading(true);
    try {
      const response = await fetch(MEDIA_API);
      const data = await response.json();
      setMediaList(data);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Файл слишком большой',
        description: 'Максимальный размер: 5 МБ. Сожмите видео перед загрузкой.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const dataUrl = event.target?.result as string;
          const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

          const addResponse = await fetch(MEDIA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              url: dataUrl,
              title: file.name,
              description: '',
              media_type: mediaType,
              category: '',
              location: '',
              year: new Date().getFullYear().toString(),
            }),
          });

          if (addResponse.ok) {
            toast({
              title: 'Файл загружен',
              description: 'Медиа успешно добавлено в галерею',
            });
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

      reader.onerror = () => {
        toast({
          title: 'Ошибка чтения файла',
          description: 'Не удалось прочитать файл',
          variant: 'destructive',
        });
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('File read error:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось начать загрузку',
        variant: 'destructive',
      });
      setUploading(false);
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg border">
          <h1 className="text-2xl font-bold mb-6 text-center">Вход в админ-панель</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Введите пароль"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      </div>
    );
  }

  const images = mediaList.filter(m => m.media_type === 'image');
  const videos = mediaList.filter(m => m.media_type === 'video');

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

        <div className="mb-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Загрузить файл</h2>
          <div className="flex items-center gap-4">
            <label className="flex-1">
              <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="Loader2" className="animate-spin" size={24} />
                    <span>Загрузка...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Icon name="Upload" size={24} />
                    <span>Нажмите для выбора фото или видео (макс. 50 МБ)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Фотографии ({images.length})</h2>
              <button
                onClick={loadMedia}
                className="px-4 py-2 border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <Icon name={loading ? 'Loader2' : 'RefreshCw'} className={loading ? 'animate-spin' : ''} size={18} />
                Обновить
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Icon name="Loader2" className="animate-spin" size={32} />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Image" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет загруженных фотографий</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((media) => (
                  <div key={media.id} className="border rounded-lg overflow-hidden">
                    <img src={media.url} className="w-full aspect-video object-cover" alt={media.title} />
                    <div className="p-4 space-y-3">
                      {editingId === media.id ? (
                        <>
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Название"
                          />
                          <input
                            type="text"
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Категория"
                          />
                          <input
                            type="text"
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Описание"
                          />
                          <input
                            type="text"
                            value={editForm.year || ''}
                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Год"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(media.id)}
                              className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 px-3 py-2 border rounded hover:bg-muted transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="font-medium">{media.title}</h3>
                          <p className="text-sm text-muted-foreground">{media.category}</p>
                          <p className="text-sm text-muted-foreground">{media.location}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(media.created_at).toLocaleDateString('ru-RU')}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(media)}
                                className="px-3 py-1 border rounded hover:bg-muted transition-colors flex items-center gap-1"
                              >
                                <Icon name="Pencil" size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(media.id)}
                                className="px-3 py-1 bg-destructive text-white rounded hover:bg-destructive/90 transition-colors flex items-center gap-1"
                              >
                                <Icon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Видео ({videos.length})</h2>
            </div>

            {videos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Video" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет загруженных видео</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((media) => (
                  <div key={media.id} className="border rounded-lg overflow-hidden">
                    <video src={media.url} className="w-full aspect-video object-cover" controls />
                    <div className="p-4 space-y-3">
                      {editingId === media.id ? (
                        <>
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Название"
                          />
                          <input
                            type="text"
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Категория"
                          />
                          <input
                            type="text"
                            value={editForm.location || ''}
                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Описание"
                          />
                          <input
                            type="text"
                            value={editForm.year || ''}
                            onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                            placeholder="Год"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveEdit(media.id)}
                              className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 px-3 py-2 border rounded hover:bg-muted transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="font-medium">{media.title}</h3>
                          <p className="text-sm text-muted-foreground">{media.category}</p>
                          <p className="text-sm text-muted-foreground">{media.location}</p>
                          <div className="flex items-center justify-between pt-2">
                            <span className="text-sm text-muted-foreground">
                              {new Date(media.created_at).toLocaleDateString('ru-RU')}
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(media)}
                                className="px-3 py-1 border rounded hover:bg-muted transition-colors flex items-center gap-1"
                              >
                                <Icon name="Pencil" size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(media.id)}
                                className="px-3 py-1 bg-destructive text-white rounded hover:bg-destructive/90 transition-colors flex items-center gap-1"
                              >
                                <Icon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}