import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    '''API для управления мастерами: получение списка, обновление и удаление данных'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }

    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        if method == 'GET':
            cur.execute('SELECT * FROM masters ORDER BY display_order ASC')
            masters = cur.fetchall()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(m) for m in masters], default=str),
                'isBase64Encoded': False
            }

        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            master_id = body.get('id')

            if not master_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Master ID required'}),
                    'isBase64Encoded': False
                }

            update_fields = []
            update_values = []
            
            if 'name' in body:
                update_fields.append('name = %s')
                update_values.append(body['name'])
            
            if 'description' in body:
                update_fields.append('description = %s')
                update_values.append(body['description'])
            
            if 'photo_url' in body:
                update_fields.append('photo_url = %s')
                update_values.append(body['photo_url'])
            
            if not update_fields:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            update_values.append(master_id)
            
            query = f"UPDATE masters SET {', '.join(update_fields)} WHERE id = %s"
            cur.execute(query, update_values)
            conn.commit()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }

        elif method == 'DELETE':
            query_params = event.get('queryStringParameters') or {}
            master_id = query_params.get('id')

            if not master_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Master ID required'}),
                    'isBase64Encoded': False
                }

            cur.execute('DELETE FROM masters WHERE id = %s', (master_id,))
            conn.commit()

            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True}),
                'isBase64Encoded': False
            }

        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()