import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const MASTERS_API = 'https://functions.poehali.dev/fff54d0d-ca89-4a7c-b0c6-163121618042';
const UPLOAD_API = 'https://functions.poehali.dev/34876a78-f76d-4862-8d89-f950c302216f';

interface Master {
  id: number;
  name: string;
  description: string;
  photo_url: string | null;
  display_order: number;
}

export function useMastersManagement(compressImage: (file: File) => Promise<string>) {
  const [masters, setMasters] = useState<Master[]>([]);
  const [editingMasterId, setEditingMasterId] = useState<number | null>(null);
  const [masterForm, setMasterForm] = useState<Partial<Master>>({});
  const { toast } = useToast();

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

  return {
    masters,
    editingMasterId,
    masterForm,
    loadMasters,
    startEditMaster,
    cancelEditMaster,
    saveMaster,
    handleMasterPhotoUpload,
    setMasterForm,
  };
}
