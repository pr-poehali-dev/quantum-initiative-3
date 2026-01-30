import json
import os
import psycopg2
from datetime import datetime

def handler(event: dict, context) -> dict:
    """
    Telegram бот для приема заказов с сайта.
    Принимает webhook от Telegram API и обрабатывает сообщения.
    """
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
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        
        # Webhook от Telegram
        if 'message' in body:
            return handle_telegram_message(body)
        
        # Запрос с сайта на создание заказа
        if 'action' in body and body['action'] == 'create_order':
            return create_order(body)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)})
        }


def handle_telegram_message(update: dict) -> dict:
    """Обработка входящих сообщений от Telegram"""
    message = update.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    
    if text == '/start':
        send_telegram_message(
            bot_token,
            chat_id,
            "👋 Привет! Я бот магазина Natural Masterpieces.\n\n"
            "Я помогу оформить заказ. Просто нажмите кнопку 'Заказать' на сайте!"
        )
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True})
    }


def create_order(data: dict) -> dict:
    """Создание нового заказа с сайта"""
    product_index = data.get('product_index')
    product_name = data.get('product_name')
    customer_name = data.get('customer_name')
    customer_phone = data.get('customer_phone')
    
    if not all([product_index is not None, product_name, customer_name, customer_phone]):
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Не заполнены обязательные поля'})
        }
    
    # Сохранение в БД
    db_url = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    cursor.execute(
        "INSERT INTO orders (product_index, product_name, customer_name, customer_phone) "
        "VALUES (%s, %s, %s, %s) RETURNING id, created_at",
        (product_index, product_name, customer_name, customer_phone)
    )
    order_id, created_at = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    
    # Отправка уведомления владельцу
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    owner_id = os.environ.get('TELEGRAM_OWNER_ID')
    
    message = (
        f"📦 <b>Новый заказ #{order_id}</b>\n\n"
        f"<b>Товар:</b> №{product_index + 1}. {product_name}\n"
        f"<b>Клиент:</b> {customer_name}\n"
        f"<b>Телефон:</b> {customer_phone}\n"
        f"<b>Время:</b> {created_at.strftime('%d.%m.%Y %H:%M')}"
    )
    
    send_telegram_message(bot_token, owner_id, message)
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'success': True,
            'order_id': order_id,
            'message': 'Заказ успешно оформлен! Мы свяжемся с вами в ближайшее время.'
        })
    }


def send_telegram_message(bot_token: str, chat_id: int | str, text: str) -> None:
    """Отправка сообщения через Telegram Bot API"""
    import urllib.request
    
    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    
    data = {
        'chat_id': str(chat_id),
        'text': text,
        'parse_mode': 'HTML'
    }
    
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode('utf-8'),
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            response.read()
    except Exception:
        pass