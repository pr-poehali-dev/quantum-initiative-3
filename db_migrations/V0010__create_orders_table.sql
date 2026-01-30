-- Создание таблицы для заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    product_index INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    telegram_chat_id BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new'
);

-- Индекс для быстрого поиска по дате
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Индекс для поиска по статусу
CREATE INDEX idx_orders_status ON orders(status);
