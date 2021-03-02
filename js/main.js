document.addEventListener("DOMContentLoaded", function () {
    class Service {
        static api = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/";

        static _getResponse(method) {
            return fetch(`${Service.api}/${method}`)
                .then(response => response.json())
                .catch(error => {
                    console.log(error);
                });
        }
    }

    class Product {
        constructor(template, img = 'https://placehold.it/200x150') {
            this.id = template.id_product;
            this.name = template.product_name;
            this.price = template.price;
            this.img = img;
        }

        render() {
            return `<div class="product-item">
                <img src="${this.img}">
                <h3>${this.name}</h3>
                <p>${this.price}</p>
                <button class="buy-btn" data-id="${this.id}">Купить</button>
            </div>`
        }
    }

    class Cart {
        constructor() {
            this.btn = document.querySelector(".btn-cart");
            this.block = document.querySelector(".cart-block");
            this.addedProducts = [];
        }

        showHide() {
            this.block.classList.toggle("invisible");
        }

        add(product) {
            this.addedProducts.push(product);
            console.dir(this.addedProducts);
            if (this.calcProductQuantity(product) == 1) {
                this.block.insertAdjacentHTML("beforeend", this.render(product));
                this.addTheDeleteEvent(product.id);
            } else {
                this.changeProductQuantityInMarkup(product);
            }
            this.showHideProductQuanity("show");
            this.changeSumPriceInMarkup(product.id);
        }

        delete(product) {
            const index = this.addedProducts.findIndex(p => p.id == product.id);
            console.log(index);
            let deletedProduct = this.addedProducts.splice(index, 1);

            if (this.calcProductQuantity(product) == 0) {
                this.findProductMakup(product).remove();
                this.showHideProductQuanity("show");
                if (this.calcAllProductsQuantity() == 0) {
                    this.showHideProductQuanity("hide");
                }
            } else {
                this.changeProductQuantityInMarkup(product);
                this.showHideProductQuanity("show"); //
                console.dir(this.addedProducts);
            }
            this.changeSumPriceInMarkup(product.id);
        }

        addTheDeleteEvent(id) {
            const btn = this.block.querySelector(`[data-id="${id}"]`).querySelector(".del-btn");
            btn.addEventListener("click", event => {
                let product = this.addedProducts.find(p => {
                    return p.id == event.target.dataset.id;
                });
                this.delete(product);
            });
        }

        calcProductQuantity(product) {
            return this.addedProducts.filter(p => p == product).length;
        }

        calcAllProductsQuantity() {
            return this.addedProducts.length;
        }

        showHideProductQuanity(act) {
            // стоит убрать отсюда подсчет колва продуктов
            const quantityBtn = document.querySelector(".quantity");

            if (act == "show") {
                quantityBtn.classList.remove("invisible");
                quantityBtn.innerHTML = this.calcAllProductsQuantity();
            } else {
                quantityBtn.classList.add("invisible");
            }
        }

        findProductMakup(product) {
            let productCards = this.block.querySelectorAll(".cart-item");
            for (let i = 0; i < productCards.length; i++) {
                if (productCards[i].dataset.id == product.id) {
                    return productCards[i];
                }
            }
        }

        changeProductQuantityInMarkup(product) {
            let markup = this.findProductMakup(product);
            markup.querySelector(".product-quantity").innerHTML = `Quantity: ${this.calcProductQuantity(product)}`;
        }

        calcSumPrice(id) {
            let sumPrice = 0;
            this.addedProducts.forEach(p => {
                if (p.id == id) {
                    sumPrice += p.price;
                }
            });
            return sumPrice;
        }

        changeSumPriceInMarkup(id) {
            const p = this.block.querySelector(`[data-id="${id}"]`).querySelector(".product-price");
            p.innerHTML = this.calcSumPrice(id);
        }

        render(product) {
            return `
        <div class="cart-item" data-id="${product.id}">
            <div class="product-bio">
                <img src="https://placehold.it/50x100" alt="Some image">
                <div class="product-desc">
                    <p class="product-title">${product.name}</p>
                    <p class="product-quantity">Quantity: ${this.calcProductQuantity(product)}</p>
                    <p class="product-single-price">${product.price} each</p>
                </div>
            </div>

            <div class="right-block">
                <p class="product-price">ALL PRICE</p>
                <button class="del-btn" data-id="${product.id}">&times;</button>
            </div>
        </div>`;
        }
    }

    class Shop {
        constructor(service, cart) {
            this.service = service;
            this.cart = cart;
            this.productList = [];
            this.productContainer = document.querySelector(".products");

            Service._getResponse("catalogData.json").then(products => {
                this.productList = products.map(product => new Product(product)); //composition
            })
                .then(() => {
                    this._productsRender();
                    this._initEvents();
                });
        }

        _productsRender() {
            this.productList.forEach(product => {
                this.productContainer.insertAdjacentHTML("beforeend", product.render());
            });
        }

        _initEvents() {
            this.cart.btn.addEventListener("click", event => {
                this.cart.showHide();
            });

            document.querySelectorAll(".buy-btn").forEach(btn => {
                btn.addEventListener("click", event => {
                    let foundProduct = this.productList.find(product => {
                        return product.id == event.target.dataset.id;
                    });

                    this.cart.add(foundProduct);
                });
            });
        }
    }

    const shop = new Shop(new Service(), new Cart()); //Agregation example
});