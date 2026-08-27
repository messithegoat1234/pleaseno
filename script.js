async function showProducts() {

    let res = await fetch("https://pleaseno.onrender.com/products");
    let data = await res.json();

    let container = document.querySelector("#products");

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

            if (colorName == "GRAY") {
                colorName = "lightgrey";
            }

            if (colorName == "NAVY") {
                colorName = "rgb(0, 48, 104)";
            }

            colorsHTML += `
                <span 
                    class="color-dot"
                    data-front="files/${color.imagefront}"
                    data-back="files/${color.imageback}"
                    style="background-color: ${colorName.toLowerCase()}">
                </span>
            `;
        });


        container.innerHTML += `
            <div class="product">

                <div class="product-image">

                    <a href="/pleasenoinfo/${product.website_name}">
                        <img 
                            src="files/${product.imagefront}"
                            data-front="files/${product.imagefront}"
                            data-back="files/${product.imageback}"
                        >
                    </a>

                </div>

                <div class="colors">
                    ${colorsHTML}
                </div>

            </div>
        `;
    });

    document.querySelectorAll(".color-dot").forEach(dot => {

        dot.addEventListener("click", function() {

            let product = this.closest(".product");

            let img = product.querySelector(".product-image img");

            img.src = this.dataset.front;

            img.dataset.front = this.dataset.front;
            img.dataset.back = this.dataset.back;

        });

    });


    document.querySelectorAll(".product-image img").forEach(img => {

        img.addEventListener("mouseenter", () => {
            img.src = img.dataset.back;
        });

        img.addEventListener("mouseleave", () => {
            img.src = img.dataset.front;
        });

    });

}

showProducts();
