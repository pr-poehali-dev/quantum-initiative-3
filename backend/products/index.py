import json
import os
import base64
import uuid
import boto3
import psycopg2
from typing import Optional

def handler(event: dict, context) -> dict:
    '''API для управления каталогом товаров: получение, добавление, обновление, удаление товаров и загрузка фотографий'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Authorization'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {'statusCode': 500, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Database not configured'})}
    
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            return handle_get(conn, event)
        elif method == 'POST':
            return handle_post(conn, event)
        elif method == 'PUT':
            return handle_put(conn, event)
        elif method == 'DELETE':
            return handle_delete(conn, event)
        else:
            return {'statusCode': 405, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Method not allowed'})}
    finally:
        conn.close()


def handle_get(conn, event) -> dict:
    '''Получить список всех товаров'''
    cur = conn.cursor()
    cur.execute('''
        SELECT id, name, description, price, photo_url, in_stock, display_order, created_at
        FROM products
        ORDER BY display_order ASC, created_at DESC
    ''')
    
    rows = cur.fetchall()
    products = []
    for row in rows:
        products.append({
            'id': row[0],
            'name': row[1],
            'description': row[2],
            'price': float(row[3]) if row[3] else None,
            'photo_url': row[4],
            'in_stock': row[5],
            'display_order': row[6],
            'created_at': row[7].isoformat() if row[7] else None
        })
    
    cur.close()
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(products)
    }


def handle_post(conn, event) -> dict:
    '''Добавить новый товар'''
    body = json.loads(event.get('body', '{}'))
    
    name = body.get('name')
    description = body.get('description', '')
    price = body.get('price')
    in_stock = body.get('in_stock', True)
    display_order = body.get('display_order', 0)
    photo_base64 = body.get('photo_base64')
    
    if not name:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Name is required'})}
    
    photo_url = None
    if photo_base64:
        photo_url = upload_photo(photo_base64)
    
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO products (name, description, price, photo_url, in_stock, display_order)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (name, description, price, photo_url, in_stock, display_order))
    
    product_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    
    return {
        'statusCode': 201,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'id': product_id, 'photo_url': photo_url})
    }


def handle_put(conn, event) -> dict:
    '''Обновить товар'''
    body = json.loads(event.get('body', '{}'))
    
    product_id = body.get('id')
    if not product_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Product ID is required'})}
    
    name = body.get('name')
    description = body.get('description')
    price = body.get('price')
    in_stock = body.get('in_stock')
    display_order = body.get('display_order')
    photo_base64 = body.get('photo_base64')
    
    photo_url = None
    if photo_base64:
        photo_url = upload_photo(photo_base64)
    
    updates = []
    params = []
    
    if name is not None:
        updates.append('name = %s')
        params.append(name)
    if description is not None:
        updates.append('description = %s')
        params.append(description)
    if price is not None:
        updates.append('price = %s')
        params.append(price)
    if in_stock is not None:
        updates.append('in_stock = %s')
        params.append(in_stock)
    if display_order is not None:
        updates.append('display_order = %s')
        params.append(display_order)
    if photo_url:
        updates.append('photo_url = %s')
        params.append(photo_url)
    
    if not updates:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'No fields to update'})}
    
    params.append(product_id)
    
    cur = conn.cursor()
    cur.execute(f'''
        UPDATE products
        SET {', '.join(updates)}
        WHERE id = %s
    ''', params)
    
    conn.commit()
    cur.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True, 'photo_url': photo_url})
    }


def handle_delete(conn, event) -> dict:
    '''Удалить товар'''
    body = json.loads(event.get('body', '{}'))
    product_id = body.get('id')
    
    if not product_id:
        return {'statusCode': 400, 'headers': {'Access-Control-Allow-Origin': '*'}, 'body': json.dumps({'error': 'Product ID is required'})}
    
    cur = conn.cursor()
    cur.execute('DELETE FROM products WHERE id = %s', (product_id,))
    conn.commit()
    cur.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }


def upload_photo(photo_base64: str) -> Optional[str]:
    '''Загрузить фото в S3 и вернуть CDN URL'''
    try:
        if ',' in photo_base64:
            photo_base64 = photo_base64.split(',')[1]
        
        photo_data = base64.b64decode(photo_base64)
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        file_id = str(uuid.uuid4())
        key = f'products/{file_id}.jpg'
        
        s3.put_object(
            Bucket='files',
            Key=key,
            Body=photo_data,
            ContentType='image/jpeg'
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return cdn_url
    except Exception as e:
        print(f'Photo upload error: {e}')
        return None
