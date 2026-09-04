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

            if (colorName == "GRAY" || colorName == "GREY") {
                colorName = "lightgrey";
            }

            if (colorName == "NAVY") {
                colorName = "rgb(0, 48, 104)";
            }

            if ((product.id == 19 || product.id == 20) && color.color == "BLUE") {
                colorName = "lightblue";
            }

            colorsHTML += `
                <span 
                    class="color-dot"
                    data-front="files_webp/${color.imagefront.replace(/\.[^/.]+$/, ".webp")}"
                    data-back="files_webp/${color.imageback.replace(/\.[^/.]+$/, ".webp")}"
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


        container.innerHTML += `
            <div class="product">

                <div class="product-image">

                    <a href="https://pleaseno.onrender.com/${product.website_name}">
                        <img 
                            src="files_webp/${product.imagefront.replace(/\.[^/.]+$/, ".webp")}"
                            loading="lazy"
                            decoding="async"
                            data-front="files_webp/${product.imagefront.replace(/\.[^/.]+$/, ".webp")}"
                            data-back="files_webp/${product.imageback.replace(/\.[^/.]+$/, ".webp")}"
                        >
                    </a>

                </div>

                <div class="colors">
                    ${colorsHTML}
                </div>

                <a href="https://pleaseno.onrender.com/${product.website_name}">
                    <div class='description'>
                        <p class='name'>${product.name}</p>
                        <p class='price'>${product.price} PLN</p>
                    </div>
                </a>

            </div>
        `;
    });


    document.querySelectorAll(".color-dot").forEach(dot => {

        dot.addEventListener("click", function() {

            let product = this.closest(".product");

            let img = product.querySelector(".product-image img");

            let name = product.querySelector(".name");

            img.src = this.dataset.front;

            img.dataset.front = this.dataset.front;
            img.dataset.back = this.dataset.back;

            name.textContent = this.dataset.name;

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
    
    let productWidth = 25;

	document.querySelector(".changeWidthPlus").addEventListener("click", function() {
			
    	if (productWidth == 25) {
        	productWidth = 33.3;
    	} 
    	else if (productWidth == 33.3) {
        	productWidth = 50;
    	}

    	document.querySelectorAll(".product").forEach(product => {
        	product.style.width = productWidth + "%";
    	});

    	if (productWidth == 50) {
        	document.querySelector(".changeWidthPlus").style.display = "none";
			document.querySelector("#products").style.setProperty("margin", "10px auto 50px")
    	}
		else{
			document.querySelector("#products").style.setProperty("margin", "70px auto 50px")
		}

    	if (productWidth > 25) {
        	document.querySelector(".changeWidthMinus").style.display = "block";
    	}

	});


	document.querySelector(".changeWidthMinus").addEventListener("click", function() {

    	if (productWidth == 50) {
        	productWidth = 33.3;
    	} 
    	else if (productWidth == 33.3) {
        	productWidth = 25;
    	}

    	document.querySelectorAll(".product").forEach(product => {
        	product.style.width = productWidth + "%";
    	});

    	if (productWidth == 25) {
        	document.querySelector(".changeWidthMinus").style.display = "none";
    	}

    	if (productWidth < 50) {
       	 	document.querySelector(".changeWidthPlus").style.display = "block";
    	}

	});                                                          
                                                                
}

showProducts();
