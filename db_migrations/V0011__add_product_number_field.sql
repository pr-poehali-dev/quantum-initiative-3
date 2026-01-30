-- Добавляем поле product_number для постоянного номера товара
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_number VARCHAR(50);

-- Заполняем существующие товары номерами на основе display_order
UPDATE products 
SET product_number = CAST(display_order AS VARCHAR)
WHERE product_number IS NULL;