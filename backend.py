import os
import re
import time

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

CORS(app, origins="*", supports_credentials=True)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

from mysql.connector import pooling

db_pool = pooling.MySQLConnectionPool(
    pool_name="pleaseno_pool",
    pool_size=5,
    pool_reset_session=True,

    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    ssl_ca=os.path.join(os.path.dirname(__file__), "ca.pem")
)

def get_db():
    return db_pool.get_connection()


def save_visit(page):
    try:
        connect = get_db()
        cursor = connect.cursor()

        ip = request.headers.get("X-Forwarded-For", request.remote_addr)

        if ip and "," in ip:
            ip = ip.split(",")[0].strip()

        user_agent = request.headers.get("User-Agent", "")
        referer = request.headers.get("Referer", "")

        if "iPhone" in user_agent:
            device = "iPhone"
        elif "iPad" in user_agent:
            device = "iPad"
        elif "Android" in user_agent:
            device = "Android"
        elif "Windows" in user_agent:
            device = "Windows PC"
        elif "Macintosh" in user_agent:
            device = "Mac"
        elif "Linux" in user_agent:
            device = "Linux"
        else:
            device = "Unknown"

        if "iPhone OS" in user_agent:
            match = re.search(r"iPhone OS ([0-9_]+)", user_agent)

            if match:
                os_name = "iOS " + match.group(1).replace("_", ".")
            else:
                os_name = "iOS"

        elif "iPad" in user_agent:
            os_name = "iPadOS"

        elif "Android" in user_agent:
            match = re.search(r"Android ([0-9.]+)", user_agent)

            if match:
                os_name = "Android " + match.group(1)
            else:
                os_name = "Android"

        elif "Windows NT" in user_agent:
            os_name = "Windows"

        elif "Mac OS X" in user_agent:
            os_name = "macOS"

        elif "Linux" in user_agent:
            os_name = "Linux"

        else:
            os_name = "Unknown"

        if "Instagram" in user_agent:
            browser = "Instagram"

        elif "Edg/" in user_agent:
            browser = "Microsoft Edge"

        elif "OPR/" in user_agent:
            browser = "Opera"

        elif "Chrome/" in user_agent:
            browser = "Chrome"

        elif "Firefox/" in user_agent:
            browser = "Firefox"

        elif "Safari/" in user_agent:
            browser = "Safari"

        else:
            browser = "Unknown"

        utm_source = request.args.get("utm_source")
        utm_medium = request.args.get("utm_medium")
        utm_campaign = request.args.get("utm_campaign")
        utm_content = request.args.get("utm_content")
        
        cursor.execute("""
            INSERT INTO visits (
                ip,
                device,
                browser,
                os,
                referer,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_content,
                page
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            ip,
            device,
            browser,
            os_name,
            referer,
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            page
        ))

        connect.commit()

        cursor.close()
        connect.close()

        print(
            "VISIT:",
            ip,
            device,
            browser,
            os_name,
            referer,
            utm_source,
            page
        )

    except Exception as e:
        print("ANALYTICS ERROR:", e)




@app.route("/health/db")
def health_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    cursor.fetchone()
    cursor.close()
    conn.close()
    return "OK"
# =========================
# INDEX
# =========================

@app.route("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


# =========================
# PRODUCT PAGE
# =========================

@app.route("/<website_name>")
def product_page(website_name):

    # Nie pozwalamy, żeby np. /style.css zostało potraktowane
    # jako nazwa produktu
    if "." in website_name:
        return send_from_directory(BASE_DIR, website_name)

    return send_from_directory(BASE_DIR, "product.html")


# =========================
# WEBP
# =========================

@app.route("/files_webp/<path:filename>")
def files_webp(filename):
    return send_from_directory(
        os.path.join(BASE_DIR, "files_webp"),
        filename
    )


# =========================
# PRODUCTS API
# =========================

@app.route("/products")
def show_products():

    start = time.time()

    connect = get_db()

    print("DB CONNECT:", time.time() - start)

    cursor = connect.cursor()

    cursor.execute("""
        SELECT
            products.id,
            products.website_name,
            product_colors.color,
            product_images.imagefront,
            product_images.imageback
        FROM products
        JOIN product_colors
            ON product_colors.product_id = products.id
        JOIN product_images
            ON product_images.product_id = products.id
            AND product_images.color_id = product_colors.id
    """)

    result = cursor.fetchall()

    cursor.close()
    connect.close()

    print("TOTAL:", time.time() - start)

    return jsonify([
        {
            "id": row[0],
            "website_name": row[1],
            "color": row[2],
            "imagefront": row[3],
            "imageback": row[4]
        }
        for row in result
    ])


# =========================
# SINGLE PRODUCT API
# =========================

@app.route("/products/<website_name>")
def get_product(website_name):

    connect = get_db()
    cursor = connect.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            products.id,
            products.name,
            products.website_name,
            products.description,
            products.sizeGuideLink,
            products.sizes,
            product_colors.id AS color_id,
            product_colors.color,
            product_images.imagefront,
            product_images.imageback
        FROM products
        JOIN product_colors
            ON product_colors.product_id = products.id
        JOIN product_images
            ON product_images.product_id = products.id
            AND product_images.color_id = product_colors.id
        WHERE products.website_name = %s
    """, (website_name,))

    products = cursor.fetchall()

    cursor.close()
    connect.close()

    if not products:
        return jsonify({"error": "Product not found"}), 404

    return jsonify(products)


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
