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

function renderProduct(id, args){
    const newDiv = document.createElement("div");

    const productBanner = document.createElement("div");
    productBanner.style.backgroundImage = `url("${args.image}")`;
    productBanner.classList.add("product-banner");

    const descDiv = document.createElement("div");

    const infoDiv = document.createElement("div");
    const productName = document.createElement("h1");
    const productPrice = document.createElement("p");

    productName.innerHTML = args.name;
    productPrice.innerHTML = `$${args.price.toLocaleString()}`;

    infoDiv.append(productName, productPrice);

    const optionsDiv = document.createElement("div");

    const editButton = document.createElement("button");
    const editImage = document.createElement("img");

    const deleteButton = document.createElement("button");
    const deleteImage = document.createElement("img");

    editImage.src = "../icons/edit.png";
    editButton.addEventListener("click", async function(e){
        e.preventDefault();
        editImage.style.filter = "invert(0)";
        editImage.src = "../icons/loading.gif";

        try{
            const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/getProductById/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                mode: 'cors'
            });

            let content = await response.json();
            console.log(content);

            document.getElementById("product-name").value = content.name;
            document.getElementById("product-description").value = content.description;
            document.querySelector(".dropdown-selected").children[0].src = `../icons/${content.category.toLowerCase()}.png`;
            document.querySelector(".dropdown-selected").children[1].textContent = content.category;
            document.getElementById("upload-data").textContent = content.image;
            document.querySelectorAll(".toggle-checkbox")[1].checked = content.approved;

            document.getElementById("product-price").value = content.price;

            if(content.price === 0){
                document.querySelectorAll(".toggle-checkbox")[1].checked = true;
            }

            document.getElementById('right-modal-header').innerHTML = 'Edit Product Details';
            document.getElementById('modal-submit').setAttribute("onclick", `editProduct('${id}')`);
            toggleRightModal(true);

        } catch (e) {
            console.error(e);
        }

        editImage.style.filter = "invert(0.25)";
        editImage.src = "../icons/edit.png";
    });

    deleteImage.src = "../icons/delete.png";
    deleteButton.addEventListener("click", async function(e){
        e.preventDefault();

        await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/deleteProduct/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            mode: 'cors'
        });

        await productsInit();
    })

    editButton.setAttribute("title", "Edit Product Details");
    editButton.appendChild(editImage);

    deleteButton.setAttribute("title", "Delete Product From Store");
    deleteButton.appendChild(deleteImage);

    optionsDiv.append(editButton, deleteButton);

    descDiv.append(infoDiv, optionsDiv);

    newDiv.append(productBanner, descDiv);
    newDiv.classList.add("product");

    document.getElementById("products-list").insertBefore(newDiv, document.getElementById("add-product"))
}

async function productsInit(){
    document.querySelectorAll('#products-list > *').forEach(element => {
        if(element.id !== 'add-product') {
            element.remove();
        }
    });

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

    if(context.message != null) return;

    for(let i = 0; i < Object.values(context).length; i++){
        renderProduct(Object.keys(context)[i], Object.values(context)[i]);
    }
}

function createProductModal(){
    document.getElementById('right-modal-header').innerHTML = 'New Product Details';
    document.getElementById('modal-submit').setAttribute("onclick", "createProduct()");
    toggleRightModal(true)
}

async function editProduct(id){
    let price;

    if (document.querySelectorAll(".toggle-checkbox")[0].checked) {
        price = 0;
    } else {
        price = Number(document.getElementById("product-price").value);
    }

    const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/editProduct`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PATCH',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            id:id,
            args: {
                name: document.getElementById("product-name").value,
                description: document.getElementById("product-description").value,
                category: document.querySelector(".dropdown-selected").children[1].textContent,
                image: document.getElementById("upload-data").textContent,
                approved: document.querySelectorAll(".toggle-checkbox")[1].checked,
                price: price,
                likes:0
            }
        }),
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    if(context.message.includes("successfully")){
        toggleRightModal(false);
        await productsInit();
    };
}

async function createProduct(){
    let price;

    if (document.querySelectorAll(".toggle-checkbox")[0].checked) {
        price = 0;
    } else {
        price = Number(document.getElementById("product-price").value);
    }

    const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/createProduct`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            name: document.getElementById("product-name").value,
            description: document.getElementById("product-description").value,
            category: document.querySelector(".dropdown-selected").children[1].textContent,
            image: document.getElementById("upload-data").textContent,
            approved: document.querySelectorAll(".toggle-checkbox")[1].checked,
            price: price,
            likes:0
        }),
        mode: 'cors'
    });

    const context = await response.json();
    console.log(context);

    if(context.message === "New Product Created"){
        toggleRightModal(false);
        await productsInit();
    }
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
            selected.children[0].src = `../icons/${this.getAttribute('data-value').toLowerCase()}.png`;
            selected.children[1].textContent = this.getAttribute('data-value');
            selectedSorting = parseInt(this.getAttribute('data-sorting'));
            options.style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
            options.style.display = 'none';
        }
    });

    const uploadDiv = document.getElementById('upload-image-div');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Accept only images

    fileInput.addEventListener('change', function(e) {
        handleFiles(this.files);
    });

    uploadDiv.addEventListener('click', function() {
        fileInput.click(); // Simulate file input click on div click
    });

    uploadDiv.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadDiv.classList.add('drag-over');
    });

    uploadDiv.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadDiv.classList.remove('drag-over');
    });

    uploadDiv.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadDiv.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        handleFiles(files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvasData = resizeAndCropImage(img);
                document.getElementById('upload-data').innerText = canvasData;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function resizeAndCropImage(img) {
        const canvas = document.createElement('canvas');
        const size = 256; // Desired size
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Determine the scaling and cropping dimensions
        let sourceX, sourceY, sourceWidth, sourceHeight;
        if (img.width > img.height) {
            const scale = size / img.height;
            sourceHeight = img.height;
            sourceWidth = img.height;
            sourceX = (img.width - img.height) / 2;
            sourceY = 0;
        } else {
            const scale = size / img.width;
            sourceHeight = img.width;
            sourceWidth = img.width;
            sourceX = 0;
            sourceY = (img.height - img.width) / 2;
        }

        // Draw the image onto the canvas, resizing and cropping it
        ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, size, size);

        // Convert the canvas to a data URL and return it
        return canvas.toDataURL();
    }

    productsInit();
});