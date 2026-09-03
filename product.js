async function showProduct() {

    const parts = window.location.pathname.split("/");
    const websiteName = parts[parts.length - 1];

    let res = await fetch(
        `https://pleaseno.onrender.com/products/${websiteName}`
    );

    let data = await res.json();

    if (!data || data.length === 0) {
        return;
    }

    data.forEach(product => {
        if (product.color === "DARKGREEN") {
            product.color = "CAMO";
        }
    });

    let product = data[0];

    let container = document.querySelector("#product");

    let choice = product.color;


    if (
        product.website_name === "dachshund-flag-tee" &&
        choice === "CAMO"
    ) {
        product.description = "UNISEX\n240GSM\n100% COTTON\nOVERSIZED";
        product.sizes = "S M L XL 2XL";
    }

    if (
        product.website_name === "dachshund-flag-longsleeve" &&
        choice === "PINK"
    ) {
        product.description =
            "UNISEX\n230GSM\n100% COTTON\nOVERSIZED\nWASHED";
    }

    container.innerHTML = `
        <div class="product-page">

            <div class="product-images">

                <img 
                    id="front" 
                    src="files_webp/${product.imagefront.replace(/\.[^/.]+$/, ".webp")}"
                >

                <img 
                    id="back" 
                    src="files_webp/${product.imageback.replace(/\.[^/.]+$/, ".webp")}"
                >

            </div>


            <div class="product-info">

                <h1>${product.name}</h1>


                <p id="description">
                    ${product.description.replace(/\n/g, "<br>")}
                </p>


                <div class="price">
                    ${product.price} PLN
                </div>


                <div class="colors">

                    ${data.map(color => `
                        <p
                            class="${color.color.toLowerCase()} ${
                                color.color === choice ? "selected" : ""
                            }"
                            data-color="${color.color}"
                        >
                            ${color.color}
                        </p>
                    `).join("")}

                </div>


                <div class="sizes" id="sizes">

                    ${product.sizes.split(" ").map(size => `
                        <p>${size}</p>
                    `).join("")}

                </div>


                <div class="order">
                    ORDER VIA INSTAGRAM <br>
                    <span class="igName">@PLEASENOWORLD</span>
                    OR
                    <span class="igName">@LEONOSZAJCA</span>
                </div>

            </div>

        </div>
    `;


    document.querySelectorAll(".colors p").forEach(colorElement => {

        colorElement.addEventListener("click", function() {

            choice = this.dataset.color;

            let selectedProduct = data.find(
                product => product.color === choice
            );


            if (!selectedProduct) {
                return;
            }


            let description = selectedProduct.description;
            let sizes = selectedProduct.sizes;


            if (
                selectedProduct.website_name === "dachshund-flag-tee" &&
                choice === "CAMO"
            ) {
                description =
                    "UNISEX\n240GSM\n100% COTTON\nOVERSIZED";

                sizes = "S M L XL 2XL";
            }


            if (
                selectedProduct.website_name === "dachshund-flag-longsleeve" &&
                choice === "PINK"
            ) {
                description =
                    "UNISEX\n230GSM\n100% COTTON\nOVERSIZED\nWASHED";
            }


            document.querySelector("#front").src =
                `files_webp/${selectedProduct.imagefront.replace(
                    /\.[^/.]+$/,
                    ".webp"
                )}`;


            document.querySelector("#back").src =
                `files_webp/${selectedProduct.imageback.replace(
                    /\.[^/.]+$/,
                    ".webp"
                )}`;


            document.querySelector("#description").innerHTML =
                description.replace(/\n/g, "<br>");

            document.querySelector("#sizes").innerHTML =
                sizes.split(" ").map(size => `
                    <p>${size}</p>
                `).join("");


            document.querySelectorAll(".colors p").forEach(element => {
                element.classList.remove("selected");
            });

            this.classList.add("selected");

        });

    });


    let title = document.querySelector("title");

    title.innerHTML = product.name;

}


showProduct();
