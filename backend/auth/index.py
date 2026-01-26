import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta

SESSIONS = {}

def get_db_connection():
    pass

def handler(event: dict, context) -> dict:
    '''API для авторизации в админ-панели с проверкой пароля'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            },
            'body': ''
        }

    # POST /auth - проверка пароля
    if method == 'POST':
        try:
            body = json.loads(event.get('body', '{}'))
            password = body.get('password', '')
            admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')

            if password == admin_password:
                session_token = secrets.token_urlsafe(32)
                expires_at = datetime.now() + timedelta(hours=24)
                SESSIONS[session_token] = expires_at.isoformat()

                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({
                        'success': True,
                        'token': session_token,
                        'expires_at': expires_at.isoformat()
                    })
                }
            else:
                return {
                    'statusCode': 401,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Неверный пароль'})
                }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }

    # GET /auth/verify - проверка токена
    elif method == 'GET':
        try:
            auth_header = event.get('headers', {}).get('X-Authorization', '')
            token = auth_header.replace('Bearer ', '')

            if token in SESSIONS:
                expires_at = datetime.fromisoformat(SESSIONS[token])
                if datetime.now() < expires_at:
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'valid': True})
                    }
                else:
                    del SESSIONS[token]

            return {
                'statusCode': 401,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'valid': False})
            }

        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': str(e)})
            }

    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'})
    }
