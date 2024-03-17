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
    productPrice.innerHTML = args.price;

    infoDiv.append(productName, productPrice);

    const optionsDiv = document.createElement("div");

    const editButton = document.createElement("button");
    const editImage = document.createElement("img");

    const deleteButton = document.createElement("button");
    const deleteImage = document.createElement("img");

    editImage.src = "../icons/edit.png";
    editButton.addEventListener("click", function(e){
        //Something Should Go Here
    });

    deleteImage.src = "../icons/delete.png";
    deleteButton.addEventListener("click", async function(e){
        e.preventDefault();

        const response = await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/deleteProduct/${id}`, {
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

            calculateFilter();
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