import os
import time

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from mysql.connector import pooling


app = Flask(__name__)

CORS(app, origins="*", supports_credentials=True)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))



db_pool = pooling.MySQLConnectionPool(
    pool_name="pleaseno_pool",
    pool_size=5,
    pool_reset_session=True,

    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),

    ssl_ca=os.path.join(
        BASE_DIR,
        "ca.pem"
    )
)


def get_db():
    return db_pool.get_connection()




@app.route("/health/db")
def health_db():

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT 1")
    cursor.fetchone()

    cursor.close()
    conn.close()

    return "OK"


@app.route("/collections")
def get_categories():

    connect = get_db()
    cursor = connect.cursor()

    cursor.execute("""
        SELECT DISTINCT category
        FROM products
        WHERE category IS NOT NULL
        AND category != ''
    """)

    categories = cursor.fetchall()

    cursor.close()
    connect.close()

    return jsonify([
        row[0] for row in categories
    ])

@app.route("/types")
def get_types():

    connect = get_db()
    cursor = connect.cursor()

    cursor.execute("""
        SELECT DISTINCT type
        FROM products
        WHERE type IS NOT NULL
        AND type != ''
    """)

    types = cursor.fetchall()

    cursor.close()
    connect.close()

    return jsonify([
        row[0] for row in types
    ])


@app.route("/")
def home():

    return send_from_directory(
        BASE_DIR,
        "index.html"
    )

@app.route("/collections/<category>")
def collection_page(category):

    return send_from_directory(
        BASE_DIR,
        "index.html"
    )


@app.route("/types/<type>")
def type_page(type):

    return send_from_directory(
        BASE_DIR,
        "index.html"
    )

@app.route("/<website_name>")
def product_page(website_name):

    if "." in website_name:

        return send_from_directory(
            BASE_DIR,
            website_name
        )

    return send_from_directory(
        BASE_DIR,
        "product.html"
    )




@app.route("/files_webp/<path:filename>")
def files_webp(filename):

    return send_from_directory(
        os.path.join(BASE_DIR, "files_webp"),
        filename
    )




def get_products(query, params=()):

    connect = get_db()
    cursor = connect.cursor(dictionary=True)

    try:

        cursor.execute(query, params)

        return cursor.fetchall()

    finally:

        cursor.close()
        connect.close()



PRODUCT_QUERY = """
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
        product_images.imageback,

        products.price,
        products.category,
        products.type

    FROM products

    JOIN product_colors
        ON product_colors.product_id = products.id

    JOIN product_images
        ON product_images.product_id = products.id
        AND product_images.color_id = product_colors.id
"""


@app.route("/products")
def show_products():

    start = time.time()

    products = get_products(
        PRODUCT_QUERY
    )

    print("TOTAL:", time.time() - start)

    return jsonify(products)



@app.route("/products/collection/<category>")
def show_products_by_category(category):

    category = category.replace("-", " ").upper()

    query = PRODUCT_QUERY + """
        WHERE products.category = %s
    """

    products = get_products(
        query,
        (category,)
    )

    return jsonify(products)



@app.route("/products/type/<type>")
def show_products_by_type(type):

    type = type.replace("-", " ").upper()

    query = PRODUCT_QUERY + """
        WHERE products.type = %s
    """

    products = get_products(
        query,
        (type,)
    )

    return jsonify(products)



@app.route("/products/<website_name>")
def get_product(website_name):

    query = PRODUCT_QUERY + """
        WHERE products.website_name = %s
    """

    products = get_products(
        query,
        (website_name,)
    )

    if not products:

        return jsonify({
            "error": "Product not found"
        }), 404

    return jsonify(products)



if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
