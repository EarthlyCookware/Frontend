const allowMultipleSelection = false;
const filter = {};

const originalElements = [];

const CATEGORIES = Object.freeze({
   COOKWARE: "Cookware",
   TABLEWARE: "Tableware",
   UTENSILS: "Utensils",
   ACCESSORIES: "Accessories",
   GUIDES: "Guides"
});

let selectedSorting = -1;

function calculateFilter() {
    const minPrice = parseInt(document.getElementById('minPrice').value) || 0; // Default to 0 if no value
    const maxPrice = parseInt(document.getElementById('maxPrice').value) || Infinity; // Default to Infinity if no value

    let shopElements = Array.from(document.querySelectorAll('.shop-element'));

    const listItems = Array.from(document.querySelectorAll('#treeList li.bold'));
    const selectedCategories = listItems.map(item => item.textContent.trim().toLowerCase());

    shopElements.forEach(element => {
        const priceText = element.querySelector('div:last-of-type > p').textContent;
        const price = parseFloat(priceText.replace(/^\$/, '')); // Remove the dollar sign and convert to number
        const categoryName = element.querySelector('div:first-of-type p').textContent.trim().toLowerCase();

        if (price < minPrice || price > maxPrice) {
            element.style.display = 'none';
        } else if(!selectedCategories.includes(categoryName) && selectedCategories.length !== 0){
            element.style.display = 'none';
        } else {
            element.style.display = '';
        }
    });

    shopElements = shopElements.filter(element => element.style.display !== 'none');

    if (typeof selectedSorting !== 'undefined') {
        if (selectedSorting === -1){
            // Reset everything??
        } else if (selectedSorting === 0) {
            shopElements.sort((a, b) => {
                const ratingA = parseFloat(a.children[2].children[1].children[1].textContent);
                const ratingB = parseFloat(b.children[2].children[1].children[1].textContent);

                return ratingB - ratingA;
            });
        } else if (selectedSorting === 1) {
            shopElements.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('div:last-of-type > p').textContent.replace(/^\$/, ''));
                const priceB = parseFloat(b.querySelector('div:last-of-type > p').textContent.replace(/^\$/, ''));
                return priceA - priceB;
            });
        } else if (selectedSorting === 2) {
            shopElements.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('div:last-of-type > p').textContent.replace(/^\$/, ''));
                const priceB = parseFloat(b.querySelector('div:last-of-type > p').textContent.replace(/^\$/, ''));
                return priceB - priceA;
            });
        }

        const shopList = document.getElementById('shop-list');
        shopElements.forEach(element => {
            shopList.appendChild(element); // This automatically moves them instead of copying
        });
    }
}

function toggleTree(force) {
    const treeList = document.getElementById('treeList');
    const toggleIcon = document.getElementById('toggleIcon');
    const isClosed = treeList.style.display === 'none';

    if(force === null || force === undefined){
        treeList.style.display = isClosed ? 'block' : 'none';
        toggleIcon.classList.toggle('rotate-icon', isClosed);
    } else {
        if(force){
            treeList.style.display = "block";
            toggleIcon.classList.toggle('rotate-icon', true);
        } else{
            treeList.style.display = "none";
            toggleIcon.classList.toggle('rotate-icon', false);
        }
    }
}

function selectItem(event, id) {
    const element = event.target;
    if (!allowMultipleSelection) {
        const items = document.querySelectorAll('.tree-list li');
        items.forEach(item => {
            if (item !== element) {
                item.classList.remove('bold');
            }
        });
    }
    element.classList.toggle('bold');

    calculateFilter();
}

function createShopElement(id, args) {
    originalElements.push(args)

    const { image, category, name, description, approved, price, likes } = args;

    const shopElement = document.createElement('div');
    shopElement.className = 'shop-element';

    const categoryDiv = document.createElement('div');
    const categoryP = document.createElement('p');
    categoryP.textContent = category;
    categoryDiv.appendChild(categoryP);
    categoryDiv.style.backgroundImage = `url(${image})`;

    const nameDescDiv = document.createElement('div');
    const nameH1 = document.createElement('h1');
    const descriptionP = document.createElement('p');
    nameH1.textContent = name;
    descriptionP.textContent = description;
    nameDescDiv.appendChild(nameH1);
    nameDescDiv.appendChild(descriptionP);

    const approvedDiv = document.createElement('div');
    if (approved) {
        const shopGreenLabel = document.createElement('div');
        shopGreenLabel.className = 'shop-green-label';
        shopGreenLabel.title = "Approved Eco-Friendly";
        const leafImg = document.createElement('img');
        leafImg.src = '../icons/leaf.png';
        shopGreenLabel.appendChild(leafImg);
        approvedDiv.appendChild(shopGreenLabel);
    } else {
        const shopGreenLabel = document.createElement('div');
        shopGreenLabel.className = 'shop-yellow-label';
        shopGreenLabel.title = "Pending Eco-Friendly Approval";
        const leafImg = document.createElement('img');
        leafImg.src = '../icons/pending.png';
        shopGreenLabel.appendChild(leafImg);
        approvedDiv.appendChild(shopGreenLabel);
    }

    const priceRatingDiv = document.createElement('div');
    const priceP = document.createElement('p');
    priceP.textContent = `$${price.toFixed(2)}`;
    const ratingDiv = document.createElement('div');
    const starImg = document.createElement('img');

    let likesArray = JSON.parse(localStorage.getItem('likes'));

    if(likesArray.includes(id)){
        starImg.src = '../icons/heart_filled.png';
    } else {
        starImg.src = '../icons/heart.png';
    }

    starImg.alt = "Heart";
    const ratingP = document.createElement('p');
    ratingP.textContent = likes.toString();
    ratingDiv.appendChild(starImg);
    ratingDiv.appendChild(ratingP);

    ratingDiv.addEventListener('click', async function(e) {
        console.log(starImg.src !== '../icons/heart_filled.png');

        if(starImg.src.split('/').pop() !== 'heart_filled.png'){
            starImg.src = '../icons/heart_filled.png';

            if(!likesArray.includes(id)){
                likesArray.push(id);
                localStorage.setItem('likes', JSON.stringify(likesArray));

                const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/increaseLikes/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    }
                });

                const context = await response.json();
                console.log(context);
            }
        } else {
            starImg.src = '../icons/heart.png';

            likesArray = likesArray.filter(item => item !== id);
            localStorage.setItem('likes', JSON.stringify(likesArray));

            const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/decreaseLikes/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });

            const context = await response.json();
            console.log(context);
        }
    });

    priceRatingDiv.appendChild(priceP);
    priceRatingDiv.appendChild(ratingDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.appendChild(nameDescDiv);
    detailsDiv.appendChild(approvedDiv);

    shopElement.appendChild(categoryDiv);
    shopElement.appendChild(detailsDiv);
    shopElement.appendChild(priceRatingDiv);

    shopElement.addEventListener("click", function(e){
        e.preventDefault();
        addToCart(args)
    })

    document.getElementById('shop-list').appendChild(shopElement);
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

document.addEventListener('DOMContentLoaded', function() {
    const dropdown = document.querySelector('.dropdown');
    const selected = document.querySelector('.dropdown-selected');
    const options = document.querySelector('.dropdown-options');

    dropdown.addEventListener('click', function() {
        const isOpen = options.style.display === 'block';
        options.style.display = isOpen ? 'none' : 'block';
    });

    document.querySelectorAll('.dropdown-option').forEach(option => {
        option.addEventListener('click', function() {
            selected.textContent = this.getAttribute('data-value');
            selectedSorting = parseInt(this.getAttribute('data-sorting'));
            options.style.display = 'none';
            
            calculateFilter();
        });
    });

    window.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            options.style.display = 'none';
        }
    });

    initialize();
});

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

function toggleElement(element, forceToggle) {
    if (typeof forceToggle === 'boolean') {
        if (forceToggle) {
            element.classList.add('inactive-modal');
        } else {
            element.classList.remove('inactive-modal');
        }
    } else {
        element.classList.toggle('inactive-modal');
    }
}

function updateCartTotals(){
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    if(Object.keys(cart).length > 0){
        document.getElementById("cart-modal-button-img").src = "../icons/cart_full.png";
    } else {
        document.getElementById("cart-modal-button-img").src = "../icons/cart_empty.png";
    }

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

function isValueInLikes(value) {
    const likes = JSON.parse(localStorage.getItem('likes')); // Retrieves 'likes' array from localStorage
    return likes.includes(value); // Checks if the value is in the 'likes' array
}

async function initialize() {
    toggleTree(true);

    initCart();

    if (!localStorage.getItem('likes')) {
        localStorage.setItem('likes', JSON.stringify([])); // Initializes 'likes' with an empty array
    }

    const response = await fetch("https://us-central1-ancientearth-cookware.cloudfunctions.net/app/getProducts", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    for(let i = 0; i < Object.values(context).length; i++){
        createShopElement(Object.keys(context)[i], Object.values(context)[i]);
    }
}