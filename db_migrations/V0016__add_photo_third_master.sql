-- Добавление фото третьему мастеру
UPDATE masters 
SET 
  photo_url = 'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/04bcd002-1c8d-4baa-b7a0-788e07b705b0.jpg',
  updated_at = NOW()
WHERE id = 4;