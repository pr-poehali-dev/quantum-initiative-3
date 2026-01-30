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
    print(f"Received update: {json.dumps(update)}")
    
    message = update.get('message', {})
    chat_id = message.get('chat', {}).get('id')
    text = message.get('text', '')
    
    print(f"Chat ID: {chat_id}, Text: {text}")
    
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    
    if text == '/start':
        print(f"Sending /start response to chat {chat_id}")
        result = send_telegram_message(
            bot_token,
            chat_id,
            "👋 Привет! Я бот магазина Natural Masterpieces.\n\n"
            "Я помогу оформить заказ. Просто нажмите кнопку 'Заказать' на сайте!"
        )
        print(f"Send result: {result}")
    
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
    contact_method = data.get('contact_method', 'telegram')
    contact_value = data.get('contact_value', customer_phone)
    comment = data.get('comment', '')
    
    if not all([product_index is not None, product_name, customer_name]):
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
        (product_index, product_name, customer_name, contact_value if contact_method in ['phone', 'telegram'] else '')
    )
    order_id, created_at = cursor.fetchone()
    conn.commit()
    cursor.close()
    conn.close()
    
    # Отправка уведомления владельцу
    bot_token = os.environ.get('TELEGRAM_BOT_TOKEN')
    owner_id = os.environ.get('TELEGRAM_OWNER_ID')
    
    contact_label = {
        'telegram': '📱 Telegram',
        'phone': '☎️ Телефон',
        'email': '📧 Email',
        'other': '💬 Контакт'
    }.get(contact_method, '💬 Контакт')
    
    message = (
        f"📦 <b>Новый заказ #{order_id}</b>\n\n"
        f"<b>Товар:</b> №{product_index + 1}. {product_name}\n"
        f"<b>Клиент:</b> {customer_name}\n"
        f"<b>{contact_label}:</b> {contact_value}\n"
        f"<b>Время:</b> {created_at.strftime('%d.%m.%Y %H:%M')}"
    )
    
    if comment:
        message += f"\n\n💭 <b>Комментарий:</b>\n{comment}"
    
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


def send_telegram_message(bot_token: str, chat_id: int | str, text: str) -> dict:
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
            result = response.read().decode('utf-8')
            print(f"Telegram API response: {result}")
            return json.loads(result)
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return {'ok': False, 'error': str(e)}