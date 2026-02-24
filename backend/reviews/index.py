import json
import os
import psycopg2

SCHEMA = "t_p62124492_quantum_initiative_3"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def handler(event: dict, context) -> dict:
    """Управление отзывами: GET — список опубликованных, POST — новый отзыв, PATCH — публикация/скрытие, DELETE — удаление"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    admin = params.get("admin") == "1"

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            if admin:
                cur.execute(
                    f"SELECT id, name, city, product_number, product_name, rating, text, published, created_at FROM {SCHEMA}.reviews ORDER BY created_at DESC"
                )
            else:
                cur.execute(
                    f"SELECT id, name, city, product_number, product_name, rating, text, published, created_at FROM {SCHEMA}.reviews WHERE published = TRUE ORDER BY created_at DESC"
                )
            rows = cur.fetchall()
            cols = ["id", "name", "city", "product_number", "product_name", "rating", "text", "published", "created_at"]
            result = []
            for row in rows:
                d = dict(zip(cols, row))
                d["created_at"] = d["created_at"].isoformat() if d["created_at"] else None
                result.append(d)
            return {"statusCode": 200, "headers": cors, "body": json.dumps(result, ensure_ascii=False)}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            name = (body.get("name") or "").strip()
            city = (body.get("city") or "Красноярск").strip()
            product_number = (body.get("product_number") or "").strip()
            product_name = (body.get("product_name") or "").strip()
            rating = int(body.get("rating") or 5)
            text = (body.get("text") or "").strip()

            if not name or not text:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Имя и текст обязательны"}, ensure_ascii=False)}
            if rating < 1 or rating > 5:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "Оценка от 1 до 5"}, ensure_ascii=False)}

            cur.execute(
                f"INSERT INTO {SCHEMA}.reviews (name, city, product_number, product_name, rating, text, published) VALUES (%s, %s, %s, %s, %s, %s, FALSE) RETURNING id",
                (name, city, product_number, product_name, rating, text)
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {"statusCode": 201, "headers": cors, "body": json.dumps({"id": new_id, "success": True}, ensure_ascii=False)}

        if method == "PATCH":
            body = json.loads(event.get("body") or "{}")
            review_id = body.get("id")
            published = body.get("published")
            if not review_id:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "id обязателен"}, ensure_ascii=False)}
            cur.execute(f"UPDATE {SCHEMA}.reviews SET published = %s WHERE id = %s", (published, review_id))
            conn.commit()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"success": True}, ensure_ascii=False)}

        if method == "DELETE":
            body = json.loads(event.get("body") or "{}")
            review_id = body.get("id")
            if not review_id:
                return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "id обязателен"}, ensure_ascii=False)}
            cur.execute(f"DELETE FROM {SCHEMA}.reviews WHERE id = %s", (review_id,))
            conn.commit()
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"success": True}, ensure_ascii=False)}

        return {"statusCode": 405, "headers": cors, "body": json.dumps({"error": "Method not allowed"}, ensure_ascii=False)}

    finally:
        cur.close()
        conn.close()