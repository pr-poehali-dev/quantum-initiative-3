UPDATE products
SET name = initcap(trim(name))
WHERE name != initcap(trim(name)) OR name != trim(name);