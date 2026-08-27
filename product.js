async function showProduct() {

    const parts = window.location.pathname.split("/");
    const websiteName = parts[parts.length - 1];

    let res = await fetch(
        `/products/${websiteName}`
    );

    let data = await res.json();

    let product = data[0];

    let container = document.querySelector("#product");

    let choice = data[0].color;

    container.innerHTML = `
        <div class="product-page">

            <div class="product-images">
                <img id="front" src="files/${product.imagefront}">
                <img id="back" src="files/${product.imageback}">
            </div>

            <div class="product-info">

                <h1>${product.name}</h1>

                <p>${product.description.replace(/\n/g, "<br>")}</p>

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
                `files/${selectedProduct.imagefront}`;

            document.querySelector("#back").src =
                `files/${selectedProduct.imageback}`;


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