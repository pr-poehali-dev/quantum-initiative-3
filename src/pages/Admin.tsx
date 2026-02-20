import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductsAdmin } from '@/components/ProductsAdmin';
import { LoginForm } from '@/components/admin/LoginForm';
import { FileUploader } from '@/components/admin/FileUploader';
import { MediaGallery } from '@/components/admin/MediaGallery';
import { MastersManager } from '@/components/admin/MastersManager';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useMediaManagement } from '@/hooks/useMediaManagement';
import { useMastersManagement } from '@/hooks/useMastersManagement';

export default function Admin() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    password,
    setPassword,
    handleLogin,
    handleLogout,
  } = useAdminAuth();

  const {
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
  } = useMediaManagement();

  const {
    masters,
    editingMasterId,
    masterForm,
    loadMasters,
    startEditMaster,
    cancelEditMaster,
    saveMaster,
    handleMasterPhotoUpload,
    deleteMaster,
    setMasterForm,
  } = useMastersManagement(compressImage);

  useEffect(() => {
    if (isAuthenticated) {
      loadMedia();
      loadMasters();
      
      setTimeout(() => {
        const hash = window.location.hash;
        if (hash === '#catalog') {
          const catalogElement = document.getElementById('catalog');
          if (catalogElement) {
            catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }
  }, [isAuthenticated]);

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

        <div className="mt-8" id="catalog-top">
          <ProductsAdmin />
        </div>

        <div className="mt-8">
          <MastersManager
            masters={masters}
            editingMasterId={editingMasterId}
            masterForm={masterForm}
            onEdit={startEditMaster}
            onCancelEdit={cancelEditMaster}
            onSave={saveMaster}
            onPhotoUpload={handleMasterPhotoUpload}
            onDelete={deleteMaster}
            onFormChange={setMasterForm}
          />
        </div>

        <div className="mt-8" id="catalog">
          <ProductsAdmin />
        </div>
      </div>
    </div>
  );
}