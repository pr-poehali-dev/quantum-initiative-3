-- Добавляем поле для хранения массива URL фотографий
ALTER TABLE products ADD COLUMN photos JSONB DEFAULT '[]'::jsonb;

-- Мигрируем существующие фото в массив
UPDATE products SET photos = jsonb_build_array(photo_url) WHERE photo_url IS NOT NULL;