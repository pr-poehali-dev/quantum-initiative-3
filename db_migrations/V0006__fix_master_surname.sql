-- Исправление фамилии мастера с Зиневич на Зеневич
UPDATE t_p62124492_quantum_initiative_3.masters 
SET name = 'Зеневич Владимир Иванович', 
    updated_at = CURRENT_TIMESTAMP 
WHERE id = 2;