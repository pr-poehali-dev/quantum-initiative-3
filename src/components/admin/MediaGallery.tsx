import Icon from '@/components/ui/icon';

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

interface MediaGalleryProps {
  mediaList: Media[];
  mediaUrls: Record<number, string>;
  loading: boolean;
  editingId: number | null;
  editForm: Partial<Media>;
  onRefresh: () => void;
  onEdit: (media: Media) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onEditFormChange: (form: Partial<Media>) => void;
}

export function MediaGallery({
  mediaList,
  mediaUrls,
  loading,
  editingId,
  editForm,
  onRefresh,
  onEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onEditFormChange,
}: MediaGalleryProps) {
  const images = mediaList.filter(m => m.media_type === 'image');
  const videos = mediaList.filter(m => m.media_type === 'video');

  const renderMediaCard = (media: Media) => (
    <div key={media.id} className="border rounded-lg overflow-hidden">
      {media.media_type === 'video' ? (
        mediaUrls[media.id] ? (
          <video src={mediaUrls[media.id]} className="w-full aspect-[4/3] object-contain bg-gray-100" controls />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
            <Icon name="Loader2" className="animate-spin" size={32} />
          </div>
        )
      ) : (
        mediaUrls[media.id] ? (
          <img src={mediaUrls[media.id]} className="w-full aspect-[4/3] object-contain bg-gray-100" alt={media.title} />
        ) : (
          <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
            <Icon name="Loader2" className="animate-spin" size={32} />
          </div>
        )
      )}
      <div className="p-4 space-y-3">
        {editingId === media.id ? (
          <>
            <input
              type="text"
              value={editForm.title || ''}
              onChange={(e) => onEditFormChange({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Название"
            />
            <input
              type="text"
              value={editForm.category || ''}
              onChange={(e) => onEditFormChange({ ...editForm, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Категория"
            />
            <input
              type="text"
              value={editForm.location || ''}
              onChange={(e) => onEditFormChange({ ...editForm, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Описание"
            />
            <input
              type="text"
              value={editForm.year || ''}
              onChange={(e) => onEditFormChange({ ...editForm, year: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Год"
            />
            <div className="flex gap-2">
              <button
                onClick={() => onSaveEdit(media.id)}
                className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
              >
                Сохранить
              </button>
              <button
                onClick={onCancelEdit}
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
                  onClick={() => onEdit(media)}
                  className="px-3 py-1 border rounded hover:bg-muted transition-colors flex items-center gap-1"
                >
                  <Icon name="Pencil" size={16} />
                </button>
                <button
                  onClick={() => onDelete(media.id)}
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
  );

  return (
    <div className="space-y-8">
      <div className="bg-card rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Фотографии ({images.length})</h2>
          <button
            onClick={onRefresh}
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
            {images.map(renderMediaCard)}
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
            {videos.map(renderMediaCard)}
          </div>
        )}
      </div>
    </div>
  );
}
