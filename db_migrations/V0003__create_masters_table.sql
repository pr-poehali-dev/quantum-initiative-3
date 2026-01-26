CREATE TABLE IF NOT EXISTS masters (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO masters (name, description, photo_url, display_order) VALUES 
('Имя мастера', 'Описание и опыт работы мастера. Здесь вы можете указать специализацию, достижения и философию работы.', 'https://cdn.poehali.dev/projects/7ae985cc-6f2a-4264-a699-8608e9d4cbcf/bucket/af88d9f3-26d8-4690-aa7c-e7f92b24d90b.png', 1),
('Имя мастера', 'Описание и опыт работы мастера. Здесь вы можете указать специализацию, достижения и философию работы.', NULL, 2);