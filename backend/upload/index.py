import json
import os
import base64
import uuid
import boto3
from datetime import datetime

s3 = boto3.client('s3',
    endpoint_url='https://bucket.poehali.dev',
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
)

def handler(event: dict, context) -> dict:
    '''Загрузка изображений и видео в облачное хранилище'''
    method = event.get('httpMethod', 'POST')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }

    try:
        body = json.loads(event.get('body', '{}'))
        file_data = body.get('file')
        file_type = body.get('type', 'image/jpeg')
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No file provided'})
            }

        file_bytes = base64.b64decode(file_data.split(',')[1] if ',' in file_data else file_data)
        
        ext = 'jpg'
        if 'png' in file_type:
            ext = 'png'
        elif 'webp' in file_type:
            ext = 'webp'
        elif 'mp4' in file_type:
            ext = 'mp4'
        elif 'webm' in file_type:
            ext = 'webm'
        
        filename = f"projects/{uuid.uuid4()}.{ext}"
        
        s3.put_object(
            Bucket='files',
            Key=filename,
            Body=file_bytes,
            ContentType=file_type
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{filename}"
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'url': cdn_url,
                'uploaded_at': datetime.now().isoformat()
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
