import Icon from '@/components/ui/icon';

interface Master {
  id: number;
  name: string;
  description: string;
  photo_url: string | null;
  display_order: number;
}

interface MastersManagerProps {
  masters: Master[];
  editingMasterId: number | null;
  masterForm: Partial<Master>;
  onEdit: (master: Master) => void;
  onCancelEdit: () => void;
  onSave: (id: number) => void;
  onPhotoUpload: (masterId: number, file: File) => void;
  onDelete: (id: number) => void;
  onFormChange: (form: Partial<Master>) => void;
}

export function MastersManager({
  masters,
  editingMasterId,
  masterForm,
  onEdit,
  onCancelEdit,
  onSave,
  onPhotoUpload,
  onDelete,
  onFormChange,
}: MastersManagerProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="text-xl font-semibold mb-4">Мастера</h2>
      
      <div className="space-y-4">
        {masters.map((master) => (
          <div key={master.id} className="border rounded-lg p-4">
            {editingMasterId === master.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={masterForm.name || ''}
                  onChange={(e) => onFormChange({ ...masterForm, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Имя мастера"
                />
                <textarea
                  value={masterForm.description || ''}
                  onChange={(e) => onFormChange({ ...masterForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Описание"
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => onSave(master.id)}
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="px-4 py-2 border rounded hover:bg-muted transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                {master.photo_url && (
                  <img
                    src={master.photo_url}
                    alt={master.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{master.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{master.description}</p>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onEdit(master)}
                      className="px-3 py-1 border rounded hover:bg-muted transition-colors flex items-center gap-1"
                    >
                      <Icon name="Pencil" size={16} />
                      Редактировать
                    </button>
                    <label className="px-3 py-1 border rounded hover:bg-muted transition-colors flex items-center gap-1 cursor-pointer">
                      <Icon name="Upload" size={16} />
                      Фото
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onPhotoUpload(master.id, file);
                          e.target.value = '';
                        }}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={() => onDelete(master.id)}
                      className="px-3 py-1 border border-destructive text-destructive rounded hover:bg-destructive hover:text-white transition-colors flex items-center gap-1"
                    >
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}