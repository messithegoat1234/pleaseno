async function showProduct() {

    const parts = window.location.pathname.split("/");
    const websiteName = parts[parts.length - 1];

    let res = await fetch(
        `https://pleaseno.onrender.com/products/${websiteName}`
    );

    let data = await res.json();

    let product = data[0];

    let container = document.querySelector("#product");

    if(data[0].color == "DARKGREEN"){
        data[0].color = "CAMO"
    }

    let choice = data[0].color;

    if(data[0].website_name == 'dachshund-flag-tee' && choice == "CAMO"){
        data[0].description = "UNISEX\n240GSM\n100% BAWEŁNA\nOVERSIZED"
    }

    if(data[0].website_name == 'dachshund-flag-longsleeve' && choice == "PINK"){
        data[0].description = "UNISEX\n230GSM\n100% BAWEŁNA\nOVERSIZED\nWASHED"
    }
    container.innerHTML = `
        <div class="product-page">

            <div class="product-images">
                <img id="front" src="files_webp/${product.imagefront.replace(/\.[^/.]+$/, ".webp")}">
                <img id="back" src="files_webp/${product.imageback.replace(/\.[^/.]+$/, ".webp")}">
            </div>

            <div class="product-info">

                <h1>${product.name}</h1>

                <p>${product.description.replace(/\n/g, "<br>")}</p>

                <div class='price'>
                    ${product.price} PLN 
                </div>
                
                <div class="colors">
                    ${data.map(color => `
                        <p 
                            class="${color.color.toLowerCase()} 
                            ${color.color === choice ? "selected" : ""}"
                            data-color="${color.color}">
                            ${color.color}
                        </p>
                    `).join("")}
                </div>

                <div class="sizes">
                    ${product.sizes.split(" ").map(size => `
                        <p>${size}</p>
                    `).join("")}
                </div>  

                <div class='order'>
                    ORDER VIA INSTAGRAM <br><span class='igName'>@PLEASENOWORLD</span> OR <span class='igName'>@LEONOSZAJCA</span>
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

            if (!selectedProduct) return;

            document.querySelector("#front").src =
                `files_webp/${selectedProduct.imagefront.replace(/\.[^/.]+$/, ".webp")}`;

            document.querySelector("#back").src =
                `files_webp/${selectedProduct.imageback.replace(/\.[^/.]+$/, ".webp")}`;


            document.querySelectorAll(".colors p").forEach(element => {
                element.classList.remove("selected");
            });

            this.classList.add("selected");
        });

    });
    
    let title = document.querySelector("title")

    title.innerHTML = product.name
}

showProduct();
