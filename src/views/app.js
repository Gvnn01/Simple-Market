const homeBtn = document.querySelector(".homebtn");
const cartBtn = document.querySelector(".cart-btn");
const itemClose = document.querySelector(".close-item");
const closeCartBtn = document.querySelector(".close-cart");
const closeDescBtn = document.querySelector(".close-desc");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const descDOM = document.querySelector(".cart-desc");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-item");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const descContent = document.querySelector(".desc-content");
const productsDOM = document.querySelector(".products-center");
const descriptionDOM = document.querySelector(".item-view");
const descriptionOverlay = document.querySelector(".item-description");
//const descBtn = document.querySelector(".desc-btn");

let cart = [];
let dcart = [];
let buttonsDOM = [];
let dbuttonsDOM = [];

class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items;
      products = products.map((item) => {
        const { title, price, description, type } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, description, id, image, type };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
      <article class="product">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
            <button class="desc-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              + Detalhes
            </button>
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              Adicionar a sacola
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>R$ ${product.price}</h4>
        </article>`;
    });
    productsDOM.innerHTML = result;
  }

  getCategorieButton(products) {
    const ctgButtons = [...document.querySelectorAll("li")];
    ctgButtons.forEach((ctgButton) => {
      ctgButton.addEventListener("click", () => {
        //console.log(products);
        let ctgProduct = "";
        productsDOM.innerHTML = "";
        let results = products.filter(
          (products) =>
            JSON.stringify(ctgButton.className) == JSON.stringify(products.type)
        );
        results.forEach((result) => {
          ctgProduct += `
          <article class="product">
            <div class="img-container">
              <img
                src=${result.image}
                alt="product"
              class="product-img"
            />
            <button class="desc-btn" data-id=${result.id}>
              <i class="fas fa-shopping-cart"></i>
              + Detalhes
            </button>
            <button class="bag-btn" data-id=${result.id}>
              <i class="fas fa-shopping-cart"></i>
              Adicionar a sacola
            </button>
          </div>
          <h3>${result.title}</h3>
          <h4>R$ ${result.price}</h4>
        </article>`;
        });
        productsDOM.innerHTML = ctgProduct;
        homeBtn.addEventListener("click", () => {
          this.displayProducts(products);
        });
      });
    });
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    const dbuttons = [...document.querySelectorAll(".desc-btn")];
    buttonsDOM = buttons;
    dbuttonsDOM = dbuttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "No carrinho";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "No carrinho";
        event.target.disabled = true;
        //pegando os produtos em products
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        //adicionando os produtos no carrinho
        cart = [...cart, cartItem];
        //salvando o carrinho no local storage
        Storage.saveCart(cart);
        //definindo valores no carrinho
        this.setCartValues(cart);
        //mostrar os items do carrinho
        this.addCartItem(cartItem);
        //mostrar o carrinho
        this.showCart();
      });
    });
    dbuttons.forEach((dbutton) => {
      let id = dbutton.dataset.id;
      dbutton.addEventListener("click", (event) => {
        let itemDesc = { ...Storage.getProduct(id) };
        this.displayItemDescription(itemDesc);
        this.showDesc();
      });
    });
  }
  displayItemDescription(item) {
    const div = document.createElement("div");
    div.classList.add("desc-item");
    div.innerHTML = `
    <h2 class="title-desc">${item.title}</h2>
    <div class="img">
      <img class="img-desc" src=${item.image}>        
      <p class="desc">${item.description}</p>
    </div>
    <h2 class="price-desc">R$ ${item.price}</h2>
    <button class="bag-btn" data-id=${item.id}>
        <i class="fas fa-shopping-cart"></i>
        Adicionar a sacola
    </button> 
    `;
    descContent.appendChild(div);
  }

  setCartValues(cart) {
    let tempTotal = 0;
    //let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    //cartItems.innerText = itemsTotal;
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.image} alt="product" />
    <div>
      <h4>${item.title}</h4>
      <h5>R$ ${item.price}</h5>
      <button class="remove-item" data-id=${item.id}>remover</remover>
    </div>
    <div class="qnt">
      <button class="qnt-up" data-id=${item.id}>↑</button>
      <p class="item-amount">${item.amount}</p>
      <button class="qnt-down" data-id=${item.id}>↓</button>
    </div>
    `;
    cartContent.appendChild(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  showDesc() {
    cartOverlay.classList.add("transparentBcg");
    descDOM.classList.add("showCart");
  }
  hideDesc() {
    cartOverlay.classList.remove("transparentBcg");
    descDOM.classList.remove("showCart");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    closeCartBtn.addEventListener("click", () => {
      this.hideCart();
    });
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    closeDescBtn.addEventListener("click", () => {
      this.hideDesc();
      descContent.removeChild(descContent.children[0]);
    });
    // funcionalidades do carrinho
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("qnt-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("qnt-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerHTML = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach.apply((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> Adicionar a sacola`;
  }
  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //dando setup na aplicação
  ui.setupAPP();
  //Pegando todos os produtos
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      ui.getCategorieButton(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      //      ui.getDescription();
      ui.cartLogic();
    });
});
