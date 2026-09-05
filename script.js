function displayProducts(data) {

    let container = document.querySelector("#products");

    container.innerHTML = "";

    let products = {};

    data.forEach(item => {

        if (!products[item.website_name]) {

            products[item.website_name] = {
                ...item,
                colors: []
            };

        }

        products[item.website_name].colors.push(item);

    });



    Object.values(products).forEach(product => {

        let colorsHTML = "";


        product.colors.forEach(color => {

            let colorName = color.color;


            if (
                colorName == "GRAY" ||
                colorName == "GREY"
            ) {

                colorName = "lightgrey";

            }


            if (colorName == "NAVY") {

                colorName = "rgb(0, 48, 104)";

            }


            if (
                (product.id == 19 || product.id == 20) &&
                color.color == "BLUE"
            ) {

                colorName = "lightblue";

            }


            colorsHTML += `
                <span
                    class="color-dot"

                    data-front="/files_webp/${color.imagefront.replace(
                        /\.[^/.]+$/,
                        ".webp"
                    )}"

                    data-back="/files_webp/${color.imageback.replace(
                        /\.[^/.]+$/,
                        ".webp"
                    )}"

                    data-name="${
                        product.website_name === "dachshund-flag-longsleeve" &&
                        color.color === "PINK"

                            ? "DACHSHUND FLAG WASHED LONGSLEEVE"

                            : product.name
                    }"

                    style="background-color: ${colorName.toLowerCase()}">
                </span>
            `;

        });


        let frontImage =
            `/files_webp/${product.imagefront.replace(
                /\.[^/.]+$/,
                ".webp"
            )}`;


        let backImage =
            `/files_webp/${product.imageback.replace(
                /\.[^/.]+$/,
                ".webp"
            )}`;


        container.innerHTML += `

            <div class="product">

                <div class="product-image">

                    <a href="/${product.website_name}">

                        <img

                            src="${frontImage}"

                            loading="lazy"

                            decoding="async"

                            data-front="${frontImage}"

                            data-back="${backImage}"

                        >

                    </a>

                </div>


                <div class="colors">

                    ${colorsHTML}

                </div>


                <a href="/${product.website_name}">

                    <div class="description">

                        <p class="name">
                            ${product.name}
                        </p>

                        <p class="price">
                            ${product.price} PLN
                        </p>

                    </div>

                </a>

            </div>

        `;

    });



    document.querySelectorAll(".color-dot").forEach(dot => {

        dot.addEventListener("click", function() {

            let product =
                this.closest(".product");


            let img =
                product.querySelector(
                    ".product-image img"
                );


            let name =
                product.querySelector(".name");


            img.src =
                this.dataset.front;


            img.dataset.front =
                this.dataset.front;


            img.dataset.back =
                this.dataset.back;


            name.textContent =
                this.dataset.name;

        });

    });



    document.querySelectorAll(
        ".product-image img"
    ).forEach(img => {

        img.addEventListener(
            "mouseenter",
            () => {

                img.src =
                    img.dataset.back;

            }
        );


        img.addEventListener(
            "mouseleave",
            () => {

                img.src =
                    img.dataset.front;

            }
        );
    });

    let productWidth = 25;

    let plusButton =
        document.querySelector(".changeWidthPlus");

    let minusButton =
        document.querySelector(".changeWidthMinus");

    let productsElements =
        document.querySelectorAll(".product");

    let productsContainer =
        document.querySelector("#products");

    plusButton.addEventListener("click",function() {
        
            if (productWidth == 25) {
                productWidth = 33.3;
            }

            else if (productWidth == 33.3) {
                productWidth = 50;
            }

            productsElements.forEach(
                product => {
                    product.style.width =
                        productWidth + "%";
                }
            );

            if (productWidth == 50) {
                plusButton.style.display =
                    "none";

                productsContainer.style.margin =
                    "-70px auto 50px";
            }


            if (productWidth > 25) {
                minusButton.style.display =
                    "block";
            }
        }
    );


    minusButton.addEventListener(
        "click",
        function() {
            if (productWidth == 50) {
                productWidth = 33.3;
            }

            else if (productWidth == 33.3) {
                productWidth = 25;
            }

            productsElements.forEach(
                product => {
                    product.style.width =
                        productWidth + "%";
                }
            );

            if (productWidth == 25) {
                minusButton.style.display =
                    "none";
            }

            if (productWidth < 50) {
                plusButton.style.display =
                    "block";
                productsContainer.style.margin =
                    "0 auto 50px";
            }
        }
    );
}

function slugify(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

}

async function loadMenu() {

    let menu = document.querySelector("#menu");

    let categoriesRes = await fetch(
        "https://pleaseno.onrender.com/collections"
    );

    let categories = await categoriesRes.json();

    let typesRes = await fetch(
        "https://pleaseno.onrender.com/types"
    );

    let types = await typesRes.json();


    let categoriesHTML = "";
    let typesHTML = "";


    categories.forEach(category => {

        let slug = slugify(category);

        categoriesHTML += `
            <a href="/collections/${slug}">
                <div class="menuOption">
                    ${category}
                </div>
            </a>
        `;

    });


    types.forEach(type => {

        let slug = slugify(type);

        typesHTML += `
            <a href="/types/${slug}">
                <div class="menuOption">
                    ${type}
                </div>
            </a>
        `;

    });


    menu.innerHTML = `

        <div class="menuSection">

            <p id='collectionsText'>COLLECTIONS</p>

            ${categoriesHTML}

        </div>


        <div class="menuSection">

            <p id='categoriesText'>CATEGORIES</p>

            ${typesHTML}

        </div>

    `;

}

async function loadProducts() {

    let path = window.location.pathname;

    let parts = path.split("/").filter(Boolean);

    let url;

    if (parts[0] === "collections" && parts[1]) {

        url =
            `https://pleaseno.onrender.com/products/collection/${parts[1]}`;

    }

    else if (parts[0] === "types" && parts[1]) {

        url =
            `https://pleaseno.onrender.com/products/type/${parts[1]}`;

    }

    else {

        url =
            "https://pleaseno.onrender.com/products";

    }

    try {

        let res = await fetch(url);

        if (!res.ok) {

            throw new Error(
                `HTTP error: ${res.status}`
            );

        }

        let data = await res.json();

        displayProducts(data);

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}

document.querySelector(".showMenuButton").addEventListener("click", function() {
    document.querySelector("#menu").style.right = "0";
    this.style.display = "none";
    document.querySelector(".hideMenuButton").style.display = "block";

    if (window.innerWidth <= 768) {
        document.querySelector("#menu").style.height = "370px";   
        document.querySelector("#menu").style.display = "flex";
        document.querySelector(".menuSection").style.width = "100%";
        document.querySelector("#categoriesText").style.margin = "0";
        document.querySelector("#menu").style.margin = "0";
        document.querySelector("#menu").style.width = "100%"; 
        document.querySelectorAll("#menu a").forEach(a => {
            a.style.width = "100%";
            a.style.textAlign = "center";
        });
    }
});


document.querySelector(".hideMenuButton").addEventListener("click", function() {
    document.querySelector("#menu").style.right = "700px";
    this.style.display = "none";
    document.querySelector(".showMenuButton").style.display = "block";
    if (window.innerWidth <= 768) {
        document.querySelector("#menu").style.height = "0";   
        document.querySelector("#menu").style.display = "block";   
    }
});

loadProducts();
loadMenu();
