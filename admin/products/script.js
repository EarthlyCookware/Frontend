document.getElementById("right-modal-toggler").addEventListener("click", function(e){
    toggleRightModal(false)
});

function toggleRightModal(forceToggle){
    if(forceToggle != null){
        if(forceToggle === true){
            document.getElementById("right-modal-container").classList.remove("inactive-modal");
        } else {
            document.getElementById("right-modal-container").classList.add("inactive-modal");
        }
    } else document.getElementById("right-modal-container").classList.toggle("inactive-modal");
}

function renderProduct(args){
    const newDiv = document.createElement("div");

    const productBanner = document.createElement("div");
    productBanner.style.backgroundImage = `url("${args.image}")`;
    productBanner.classList.add("product-banner");

    const descDiv = document.createElement("div");

    const infoDiv = document.createElement("div");
    const productName = document.createElement("h1");
    const productPrice = document.createElement("p");

    productName.innerHTML = args.name;
    productPrice.innerHTML = args.price;

    infoDiv.append(productName, productPrice);

    const editButton = document.createElement("button");
    const editImage = document.createElement("img");

    editImage.src = "../icons/edit.png";
    editButton.addEventListener("click", function(e){
        //Something Should Go Here
    });

    editButton.setAttribute("title", "Edit Product Details");
    editButton.appendChild(editImage);

    descDiv.append(infoDiv, editButton);

    newDiv.append(productBanner, descDiv);
    newDiv.classList.add("product");

    document.getElementById("products-list").insertBefore(newDiv, document.getElementById("add-product"))
}

async function productsInit(){
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

    Object.values(context).forEach(element => {
        renderProduct(element);
    });
} productsInit();