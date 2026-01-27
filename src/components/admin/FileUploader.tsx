import Icon from '@/components/ui/icon';

interface FileUploaderProps {
  previewFile: { url: string; type: string; name: string } | null;
  uploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmUpload: () => void;
  onCancelPreview: () => void;
}

export function FileUploader({
  previewFile,
  uploading,
  onFileSelect,
  onConfirmUpload,
  onCancelPreview,
}: FileUploaderProps) {
  return (
    <div className="mb-8 p-6 bg-card rounded-lg border">
      <h2 className="text-xl font-semibold mb-4">Загрузить файл</h2>
      
      {previewFile ? (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-muted">
            {previewFile.type === 'video' ? (
              <video src={previewFile.url} className="w-full aspect-[4/3] object-contain" controls />
            ) : (
              <img src={previewFile.url} className="w-full aspect-[4/3] object-contain" alt="Предпросмотр" />
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onConfirmUpload}
              disabled={uploading}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Icon name="Loader2" className="animate-spin" size={20} />
                  <span>Загрузка...</span>
                </>
              ) : (
                <>
                  <Icon name="Check" size={20} />
                  <span>Загрузить в галерею</span>
                </>
              )}
            </button>
            <button
              onClick={onCancelPreview}
              disabled={uploading}
              className="px-6 py-3 border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              Отмена
            </button>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Проверьте, как выглядит файл. После загрузки добавьте название и описание.
          </p>
        </div>
      ) : (
        <label>
          <div className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors">
            <div className="flex items-center justify-center gap-2">
              <Icon name="Upload" size={24} />
              <span>Нажмите для выбора фото или видео (макс. 5 МБ)</span>
            </div>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={onFileSelect}
              className="hidden"
            />
          </div>
        </label>
      )}
    </div>
  );
}
