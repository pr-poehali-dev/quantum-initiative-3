import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для управления видео в галерее'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # GET - получение списка всех видео
        if method == 'GET':
            cur.execute('SELECT * FROM videos ORDER BY created_at DESC')
            videos = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(v) for v in videos], default=str)
            }

        # POST - добавление нового видео
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            url = body.get('url')
            title = body.get('title', '')
            description = body.get('description', '')

            if not url:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'URL is required'})
                }

            cur.execute(
                'INSERT INTO videos (url, title, description) VALUES (%s, %s, %s) RETURNING *',
                (url, title, description)
            )
            conn.commit()
            video = cur.fetchone()
            cur.close()
            conn.close()

            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(video), default=str)
            }

        # DELETE - удаление видео по ID
        elif method == 'DELETE':
            params = event.get('queryStringParameters', {}) or {}
            video_id = params.get('id')

            if not video_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Video ID is required'})
                }

            cur.execute('DELETE FROM videos WHERE id = %s RETURNING id', (video_id,))
            conn.commit()
            deleted = cur.fetchone()
            cur.close()
            conn.close()

            if not deleted:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Video not found'})
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
