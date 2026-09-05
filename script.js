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

                    data-front="files_webp/${color.imagefront.replace(
                        /\.[^/.]+$/,
                        ".webp"
                    )}"

                    data-back="files_webp/${color.imageback.replace(
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
            `files_webp/${product.imagefront.replace(
                /\.[^/.]+$/,
                ".webp"
            )}`;


        let backImage =
            `files_webp/${product.imageback.replace(
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
        document.querySelector(
            ".changeWidthPlus"
        );


    let minusButton =
        document.querySelector(
            ".changeWidthMinus"
        );


    let productsElements =
        document.querySelectorAll(
            ".product"
        );


    let productsContainer =
        document.querySelector(
            "#products"
        );


    plusButton.addEventListener(
        "click",
        function() {

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


async function loadProducts() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get("category");


    const type =
        params.get("type");


    let url;


    if (category) {

        url =
            `https://pleaseno.onrender.com/products/category/${encodeURIComponent(category)}`;

    }



    else if (type) {

        url =
            `https://pleaseno.onrender.com/products/type/${encodeURIComponent(type)}`;

    }



    else {

        url =
            "https://pleaseno.onrender.com/products";

    }


    try {

        let res =
            await fetch(url);


        if (!res.ok) {

            throw new Error(
                `HTTP error: ${res.status}`
            );

        }


        let data =
            await res.json();


        displayProducts(data);

    }

    catch (error) {

        console.error(
            "Error loading products:",
            error
        );

    }

}



loadProducts();
