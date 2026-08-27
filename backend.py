import os
import re
import time

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

CORS(
    app,
    origins=[
        "http://localhost",
        "http://127.0.0.1:5500",
        "https://pleaseno.onrender.com"
    ],
    supports_credentials=True
)


def create_slug(name):
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9ąćęłńóśźż ]', '', slug)
    slug = slug.replace(' ', '-')
    return slug


def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT")),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        ssl_ca=os.path.join(os.path.dirname(__file__), "ca.pem")
    )


# =========================
# STRONA GŁÓWNA
# =========================

@app.route("/")
def home():
    return send_from_directory(".", "index.html")


# =========================
# PRODUCT PAGE
# =========================

@app.route("/<website_name>")
def product_page(website_name):
    return send_from_directory(".", "product.html")


# =========================
# PLIKI WEBP
# =========================

@app.route("/files_webp/<path:filename>")
def files_webp(filename):
    return send_from_directory(
        os.path.join(os.path.dirname(__file__), "files_webp"),
        filename
    )


# =========================
# LISTA PRODUKTÓW
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

    print("QUERY:", time.time() - start)

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
# KONKRETNY PRODUKT - API
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
        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify(products)


# =========================
# START
# =========================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
