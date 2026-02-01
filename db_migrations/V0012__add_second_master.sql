-- Добавление второго мастера с фото
INSERT INTO masters (name, description, photo_url, display_order, created_at, updated_at)
VALUES (
  'Мастер',
  'Опытный мастер по работе с деревом',
  'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/c47e04ba-4d63-4680-b303-8350c7ec1a0e.jpg',
  1,
  NOW(),
  NOW()
);