-- Восстанавливаем первого мастера
INSERT INTO t_p62124492_quantum_initiative_3.masters (id, name, description, photo_url, display_order, created_at, updated_at)
VALUES (
  1,
  'Коваленко Андрей Владимирович',
  'Создание уникальных предметов интерьера и кухонной утвари ручной работы из натуральных пород древесины. Натуральный материал, тепло рук и внимание к деталям позволяют создавать вещи, способные украсить ваш дом и сделать его уютнее. Опыт работы — 30 лет.',
  'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/af88d9f3-26d8-4690-aa7c-e7f92b24d90b.png',
  1,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  photo_url = EXCLUDED.photo_url,
  display_order = EXCLUDED.display_order,
  updated_at = CURRENT_TIMESTAMP;

-- Восстанавливаем второго мастера с НОВЫМ фото из леса
INSERT INTO t_p62124492_quantum_initiative_3.masters (id, name, description, photo_url, display_order, created_at, updated_at)
VALUES (
  2,
  'Зеневич Владимир Иванович',
  'Опыт работы мастера - 30 лет. В каждом изделии душа мастера. Уникальность изделий подчеркивается качеством обработки. Умение мастера заключается в том, чтобы разглядеть красоту материала и показать ее людям.',
  'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/1fcc5999-94b4-45fa-898f-c347165c820d.jpg',
  2,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  photo_url = EXCLUDED.photo_url,
  display_order = EXCLUDED.display_order,
  updated_at = CURRENT_TIMESTAMP;