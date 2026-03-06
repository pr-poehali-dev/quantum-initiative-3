UPDATE t_p62124492_quantum_initiative_3.media
SET
  title = CASE
    WHEN title = '' OR title IS NULL THEN title
    ELSE CONCAT(UPPER(SUBSTRING(LOWER(TRIM(title)), 1, 1)), SUBSTRING(LOWER(TRIM(title)), 2))
  END,
  category = CASE
    WHEN category = '' OR category IS NULL THEN category
    ELSE CONCAT(UPPER(SUBSTRING(LOWER(TRIM(category)), 1, 1)), SUBSTRING(LOWER(TRIM(category)), 2))
  END,
  location = CASE
    WHEN location = '' OR location IS NULL THEN location
    ELSE CONCAT(UPPER(SUBSTRING(LOWER(TRIM(location)), 1, 1)), SUBSTRING(LOWER(TRIM(location)), 2))
  END;
