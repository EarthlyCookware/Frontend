function toggleModal(newModal, oldModal){
    const modals = document.querySelectorAll('.modal');

    let allFilled = true;

    if(oldModal !== undefined && oldModal !== null){
        const modal = document.querySelectorAll(".modal")[oldModal];
        const requiredInputs = modal.querySelectorAll(".required-input");

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
                let count = 0;
                const intervalId = setInterval(() => {
                    input.style.borderColor = (count % 2 === 0) ? "red" : "var(--border-color)";
                    if (++count === 6) {
                        clearInterval(intervalId);
                        input.style.borderColor = "var(--border-color)";
                    }
                }, 250);
            }
        });
    }

    if(!allFilled) return;

    document.getElementById("progress-bar").style.background = `linear-gradient(135deg, var(--accent-color) 0%, var(--accent-gradient) ${newModal / modals.length * 100}%, var(--bg-color-2) ${newModal / modals.length * 100}%, var(--bg-color-2) 100%)`;
    document.getElementById("progress-percentage").innerHTML = `${newModal / modals.length * 100}%`;

    modals.forEach((modal, i) => {
        modal.classList.remove('active-modal');

        if (i === newModal) {
            modal.classList.add('active-modal');
        }
    });
}

function addToCart(args) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (cart[args.name]) {
        cart[args.name].quantity += 1;
    } else {
        cart[args.name] = { ...args, quantity: 1 };
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    initCart();
}

function removeFromCart(itemName) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (cart[itemName]) {
        if (cart[itemName].quantity > 1) {
            cart[itemName].quantity -= 1;
        } else {
            delete cart[itemName];
        }

        localStorage.setItem('cart', JSON.stringify(cart));

        initCart();
    } else {
        console.log("Item not found in the cart.");
    }
}

function createCartElement(args) {
    // Destructuring args to extract needed variables
    const { image, category, name, price, quantity } = args;

    // Creating the outermost div and adding the 'cart-element' class
    const cartElement = document.createElement('div');
    cartElement.className = 'cart-element';

    // Background div
    const backgroundDiv = document.createElement('div');
    backgroundDiv.className = 'cart-background';
    backgroundDiv.style.backgroundImage = `url(${image})`;

    // Category and Item Name section
    const categoryItemDiv = document.createElement('div');
    const categoryH2 = document.createElement('h2');
    categoryH2.textContent = category;
    const nameH1 = document.createElement('h1');
    nameH1.textContent = name;
    categoryItemDiv.appendChild(categoryH2);
    categoryItemDiv.appendChild(nameH1);

    // Price, Quantity section
    const priceQuantityDiv = document.createElement('div');
    const priceP = document.createElement('p');
    priceP.textContent = `$${price.toFixed(2)}`;
    const quantityH6 = document.createElement('h6');
    quantityH6.textContent = 'Quantity:';

    // Counter Container
    const counterContainer = document.createElement('div');
    counterContainer.className = 'counter-container';
    const decreaseButton = document.createElement('button');
    decreaseButton.className = 'decrease';
    decreaseButton.textContent = '-';

    const countSpan = document.createElement('span');
    countSpan.className = 'count';
    countSpan.textContent = quantity.toString();
    const increaseButton = document.createElement('button');
    increaseButton.className = 'increase';
    increaseButton.textContent = '+';

    decreaseButton.addEventListener('click', function(e) {
        e.preventDefault();

        countSpan.innerHTML = Number(countSpan.textContent) - 1;

        removeFromCart(name);

        const cart = JSON.parse(localStorage.getItem("cart"));
        document.getElementById("cart-no-elements").style.display = "flex";

        if(Object.keys(cart).length !== 0) document.getElementById("cart-no-elements").style.display = "none";

        updateCartTotals();
    });

    increaseButton.addEventListener('click', function(e) {
        e.preventDefault();

        countSpan.innerHTML = Number(countSpan.textContent) + 1;

        addToCart(args);

        const cart = JSON.parse(localStorage.getItem("cart"));
        document.getElementById("cart-no-elements").style.display = "flex";

        if(Object.keys(cart).length !== 0) document.getElementById("cart-no-elements").style.display = "none";

        updateCartTotals();
    })

    counterContainer.appendChild(decreaseButton);
    counterContainer.appendChild(countSpan);
    counterContainer.appendChild(increaseButton);
    counterContainer.setAttribute("data-item", name);

    // Assembling the structure
    priceQuantityDiv.appendChild(priceP);
    priceQuantityDiv.appendChild(quantityH6);
    priceQuantityDiv.appendChild(counterContainer);

    // Main div that holds Category/Item and Price/Quantity sections
    const mainDiv = document.createElement('div');
    mainDiv.appendChild(categoryItemDiv);
    mainDiv.appendChild(priceQuantityDiv);

    // Final assembly
    cartElement.appendChild(backgroundDiv);
    cartElement.appendChild(mainDiv);

    // Appending the created cart element to a parent container, assumed to have the ID 'cart-list'
    const cartList = document.getElementById('cart-elements');
    cartList.appendChild(cartElement);
}

function initCart(){
    let cart = JSON.parse(localStorage.getItem("cart"));

    if(cart === undefined || cart === null){
        cart = {};
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    const cartElements = document.querySelector('#cart-elements');

    Array.from(cartElements.children).forEach(child => {
        if (child.id !== 'cart-no-elements') {
            cartElements.removeChild(child);
        }
    });

    document.getElementById("cart-no-elements").style.display = "flex";

    if(Object.keys(cart).length !== 0) document.getElementById("cart-no-elements").style.display = "none";

    if (typeof cart === 'object') {
        Object.values(cart).forEach(item => createCartElement(item));
    } updateCartTotals();
}

function updateCartTotals(){
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    let subtotal = 0;

    // Iterate over each item in the cart
    for (const itemName in cart) {
        if (cart.hasOwnProperty(itemName)) {
            const item = cart[itemName];
            subtotal += item.price * item.quantity;
        }
    }

    const tax = subtotal * 0.11

    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-tax').textContent = tax.toFixed(2);

    document.getElementById("cart-total").textContent = (subtotal + tax).toFixed(2);

}

async function checkoutNow(){
    const products = [];
    const cart = JSON.parse(localStorage.getItem('cart'));

    if(cart === undefined || cart === null) location.href = "../shop";

    for(let i = 0; i < Object.values(cart).length; i++){
        products.push([Object.values(cart)[i].name, Object.values(cart)[i].quantity]);
    }

    const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/newOrder`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            customer: `${document.getElementById("first-name").value} ${document.getElementById("last-name").value}`,
            products: products,
            price: document.getElementById("cart-total").innerHTML,
        }),
        mode: 'cors'
    });

    const context = await response.json();

    if(context.message === "Order successfully created"){
        localStorage.setItem('cart', JSON.stringify({}));

        document.getElementById("progress-bar").style.background = `linear-gradient(135deg, var(--accent-color) 0%, var(--accent-gradient) 100%, var(--bg-color-2) 100%, var(--bg-color-2) 100%)`;
        document.getElementById("progress-percentage").innerHTML = `100%`;

        location.href = "../shop";
    }
}

window.onload = function(){
    toggleModal(0, null);
    initCart()
}

