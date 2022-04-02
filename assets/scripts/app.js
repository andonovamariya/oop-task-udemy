class Product {
    constructor(title, image, descr, price) {
        this.title = title;
        this.imageURL = image;
        this.description = descr;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attributeName, attributerValue) {
        this.name = attributeName;
        this.value = attributerValue;
    }
}

class Component {
    constructor(renderHookId, shouldRender = true) {
        this.hookId = renderHookId;
        if (shouldRender) {
            this.render();
        }
    }

    render() {}

    createRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if (cssClasses) {
            rootElement.className = cssClasses;
        }
        if (attributes && attributes.length > 0) {
            for (const attribute of attributes) {
                rootElement.setAttribute(attribute.name, attribute.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];
    
    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2> Total: \$${this.totalAmount.toFixed(2)} </h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce((prevValue, currItem) => prevValue + currItem.price, 0);
        return sum;
    }
    
    constructor(renderHookId) {
        super(renderHookId);
    }

    addProduct(product) {
        const updatedItems = [...this.items];
        updatedItems.push(product);
        this.cartItems = updatedItems;     
    }

    orderProducts() {
        console.log('Ordering...');
        console.log(this.items);
    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');

        cartEl.innerHTML = `
         <h2> Total: \$${0} </h2>
         <button> Order now! </button>
        `;
        const orderButton = cartEl.querySelector('button');
        orderButton.addEventListener('click',() => this.orderProducts());
        this.totalOutput = cartEl.querySelector('h2');
    }

}

class ProductItem extends Component{
    constructor(product, renderHookId) {
        super(renderHookId, false);
        this.product = product;
        this.render();
    }

    addToCard() {
        App.addProductToCart(this.product);
    }


    render() {
        const prodEl = this.createRootElement('li', 'product-item');
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageURL}" alt="${this.product.title}">
                <div class = "product-item__content">
                <h2>${this.product.title}</h2>
                <h3>\$${this.product.price}</h3>
                <p>${this.product.description}</p>
                <button>Add to cart</button>
                </div>
            </div>
        `;
        const addToCartButton = prodEl.querySelector('button');
        addToCartButton.addEventListener('click', this.addToCard.bind(this));
    }
}

class ProductList extends Component{
    products = [];

    constructor(renderHook) {
        super(renderHook);
        this.fetchProducts();
    }

    fetchProducts() {
        this.products = [new Product('A pillow','https://i5.walmartimages.com/asr/13d76a45-d9e2-4eae-b751-21e170efc212.b0afb769c1e6bbd3cf716c21c3813567.jpeg', 'A soft pillow!', 19.99),
        new Product('A carpet', 'https://i.pinimg.com/564x/ef/ce/da/efcedaf3fdfde484de66e8ee9c776939--greek-decor-mediterranean-bedroom.jpg', 'A soft carpet', 89.99)];
        this.renderProducts();
    }
    
    renderProducts() {
        for (const prod of this.products) {
            new ProductItem(prod, 'prod-list');
        }
    }

    render() { 
        this.createRootElement('ul', 'product-list', [new ElementAttribute('id', 'prod-list')]);  
        if (this.products && this.products.length > 0) {          
           this.renderProducts();
        }
        
    }
}

class Shop {
    constructor() {
        this.render();
    }

    render() {
        this.cart = new ShoppingCart('app');
        new ProductList('app');
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();