import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для управления медиа-контента (фото и видео) в галерее'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # GET - получение списка всех медиа
        if method == 'GET':
            cur.execute('SELECT * FROM media ORDER BY created_at DESC')
            media = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(m) for m in media], default=str)
            }

        # POST - добавление нового медиа
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            url = body.get('url')
            title = body.get('title', '')
            description = body.get('description', '')
            media_type = body.get('media_type', 'image')
            category = body.get('category', '')
            location = body.get('location', '')
            year = body.get('year', '')

            if not url:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'URL is required'})
                }

            cur.execute(
                'INSERT INTO media (url, title, description, media_type, category, location, year) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING *',
                (url, title, description, media_type, category, location, year)
            )
            conn.commit()
            media = cur.fetchone()
            cur.close()
            conn.close()

            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(media), default=str)
            }

        # PUT - обновление медиа по ID
        elif method == 'PUT':
            params = event.get('queryStringParameters', {}) or {}
            media_id = params.get('id')
            
            if not media_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Media ID is required'})
                }

            body = json.loads(event.get('body', '{}'))
            title = body.get('title')
            description = body.get('description')
            category = body.get('category')
            location = body.get('location')
            year = body.get('year')

            updates = []
            values = []
            
            if title is not None:
                updates.append('title = %s')
                values.append(title)
            if description is not None:
                updates.append('description = %s')
                values.append(description)
            if category is not None:
                updates.append('category = %s')
                values.append(category)
            if location is not None:
                updates.append('location = %s')
                values.append(location)
            if year is not None:
                updates.append('year = %s')
                values.append(year)

            if not updates:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'})
                }

            values.append(media_id)
            query = f"UPDATE media SET {', '.join(updates)} WHERE id = %s RETURNING *"
            
            cur.execute(query, values)
            conn.commit()
            updated = cur.fetchone()
            cur.close()
            conn.close()

            if not updated:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Media not found'})
                }

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(updated), default=str)
            }

        # DELETE - удаление медиа по ID
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            media_id = params.get('id')

            if not media_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Media ID is required'})
                }

            cur.execute('DELETE FROM media WHERE id = %s RETURNING id', (media_id,))
            conn.commit()
            deleted = cur.fetchone()
            cur.close()
            conn.close()

            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Media not found'})
                }

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'id': deleted['id']})
            }

        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'})
            }

    except Exception as e:
        if 'conn' in locals():
            conn.close()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }