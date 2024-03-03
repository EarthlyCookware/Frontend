const allowMultipleSelection = false;
const filter = {};

const originalElements = [];

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

function createShopElement(args) {
    originalElements.push(args)

    const { image, category, name, description, approved, price, rating } = args;

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
    starImg.src = '../icons/star.png';
    starImg.alt = "Star";
    const ratingP = document.createElement('p');
    ratingP.textContent = rating.toString();
    ratingDiv.appendChild(starImg);
    ratingDiv.appendChild(ratingP);

    priceRatingDiv.appendChild(priceP);
    priceRatingDiv.appendChild(ratingDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.appendChild(nameDescDiv);
    detailsDiv.appendChild(approvedDiv);

    shopElement.appendChild(categoryDiv);
    shopElement.appendChild(detailsDiv);
    shopElement.appendChild(priceRatingDiv);


    const shopList = document.getElementById('shop-list');
    shopList.appendChild(shopElement);
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

function initialize() {
    toggleTree(true);
    createShopElement({
        image: "https://www.rewilddc.com/cdn/shop/files/bf8e2ab3ad030d521966f6bdcbb39756.jpg",
        category: "Cookware",
        name: "Clay Pot",
        description: "Eco-Friendly Pot With All Natural Ingredients",
        approved: true,
        price: 24.13,
        rating: 4.6
    });

    createShopElement({
        image: "https://verostiendita.com/cdn/shop/products/image_fc4c7d52-6e1e-445e-b03f-778bfb1f5429.jpg",
        category: "Utensils",
        name: "Clay Spoons",
        description: "Pack of 6 Eco-Friendly Spoons With All Natural Ingredients",
        approved: false,
        price: 9.99,
        rating: 4.9
    });

    createShopElement({
        image: "https://tableforchange.com/wp-content/uploads/2019/10/sambhramaa-food.png",
        category: "Guides",
        name: "Insider's Guide to Vedic Cooking",
        description: "28 Recipes of Vedic Cooking",
        approved: true,
        price: 19.99,
        rating: 4.8
    });
}