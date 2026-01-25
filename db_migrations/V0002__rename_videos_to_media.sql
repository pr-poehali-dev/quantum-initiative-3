-- Переименование таблицы videos в media и добавление полей для фото
ALTER TABLE videos RENAME TO media;

-- Добавление поля для типа медиа (image или video)
ALTER TABLE media ADD COLUMN IF NOT EXISTS media_type VARCHAR(10) DEFAULT 'video';

-- Добавление полей для информации о проекте
ALTER TABLE media ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE media ADD COLUMN IF NOT EXISTS year VARCHAR(4);

-- Обновление существующих записей
UPDATE media SET media_type = 'video' WHERE media_type IS NULL;