let orderNumber = 0;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function createOrder(args){
    orderNumber++;
    const newDiv = document.createElement("div");
    newDiv.classList.add("orders-table-row");

    const numberPara = document.createElement("p");
    numberPara.innerHTML = orderNumber;
    numberPara.classList.add("orders-table-number");

    const customerName = document.createElement("p");
    customerName.innerHTML = args.customer;

    const orderProductContainer = document.createElement("div");
    const orderProduct = document.createElement("h1");
    const orderQuantity = document.createElement("p");

    orderProduct.innerHTML = args.product;
    orderQuantity.innerHTML = `QTY: ${args.quantity}`;

    orderProductContainer.append(orderProduct, orderQuantity);
    orderProductContainer.classList.add("orders-table-row-product");

    const orderStatusContainer = document.createElement("p");
    const orderStatus = document.createElement("span");

    orderStatus.classList.add("order-status");

    if(Object.keys(args.checkpoints)[Object.keys(args.checkpoints).length - 1] === "received"){
        orderStatus.classList.add("received");
        orderStatus.innerHTML = "Received";
    } else if(Object.keys(args.checkpoints)[Object.keys(args.checkpoints).length - 1] === "refunded"){
        orderStatus.classList.add("refunded");
        orderStatus.innerHTML = "Refunded";
    } else if(Object.keys(args.checkpoints)[Object.keys(args.checkpoints).length - 1] === "cancelled"){
        orderStatus.classList.add("cancelled");
        orderStatus.innerHTML = "Cancelled";
    } else {
        orderStatus.classList.add("pending");
        orderStatus.innerHTML = "Pending";
    }

    orderStatusContainer.appendChild(orderStatus);

    const orderPrice = document.createElement("p");
    orderPrice.innerHTML = `$${args.price}`;

    const orderCheckpoints = document.createElement("div");

    console.log(Object.keys(args.checkpoints));

    for(let i = 0; i < Object.keys(args.checkpoints).length; i++){
        const newCheckpointDiv = document.createElement("div");

        const newCheckpointImg = document.createElement("img");
        const newCheckpointP = document.createElement("p");

        newCheckpointP.innerHTML = `${capitalizeFirstLetter(Object.keys(args.checkpoints)[i])} on ${Object.values(args.checkpoints)[i]}`

        if(Object.keys(args.checkpoints)[i] === "placed") newCheckpointImg.src = "../icons/order_placed.png";
        else if(Object.keys(args.checkpoints)[i] === "shipped") newCheckpointImg.src = "../icons/shipping.png";
        else if(Object.keys(args.checkpoints)[i] === "delivery") newCheckpointImg.src = "../icons/delivery.png";
        else if(Object.keys(args.checkpoints)[i] === "received") newCheckpointImg.src = "../icons/check.png";
        else if(Object.keys(args.checkpoints)[i] === "refunded") newCheckpointImg.src = "../icons/refund.png";
        else if(Object.keys(args.checkpoints)[i] === "cancelled") newCheckpointImg.src = "../icons/cancelled.png";

        newCheckpointDiv.append(newCheckpointImg, newCheckpointP);
        orderCheckpoints.appendChild(newCheckpointDiv);
    }

    orderCheckpoints.classList.add("order-checkpoints");

    const orderContextContainer = document.createElement("div");
    orderContextContainer.classList.add("orders-table-more");

    const orderContextImg = document.createElement("img");
    const orderContextMenu = document.createElement("div");

    orderContextImg.src = "../icons/more.png";

    orderContextMenu.classList.add("orders-context-menu");
    orderContextMenu.classList.add("inactive-modal");

    orderContextImg.addEventListener("click", function(e){
        orderContextMenu.classList.toggle('inactive-modal');
    });

    /*orderContextImg.addEventListener("click", function(e){
        if(orderContextMenu.classList.contains('inactive-modal')){
            document.querySelectorAll(".orders-context-menu").forEach(function(element){
                 element.classList.add('inactive-modal');
            });

            orderContextMenu.classList.remove('inactive-modal');
        } else {
            orderContextMenu.classList.add('inactive-modal');
        }
    });*/

    const contextMenuElements = [
        ["update", "Update Status"],
        ["edit", "Edit Order"],
        ["message", "Message Customer"],
        ["note", "Add Note"],
        ["delete", "Cancel Order"],
    ];

    contextMenuElements.forEach((element, index) => {
        const contextMenuElement = document.createElement("div");

        const contextMenuImg = document.createElement("img");
        const contextMenuP = document.createElement("p");

        contextMenuImg.src = `../icons/${element[0]}.png`;
        contextMenuP.innerHTML = element[1];

        contextMenuElement.append(contextMenuImg, contextMenuP);
        orderContextMenu.appendChild(contextMenuElement);
    });

    orderContextContainer.append(orderContextImg, orderContextMenu);

    newDiv.append(numberPara, customerName, orderProductContainer, orderStatusContainer, orderPrice, orderCheckpoints, orderContextContainer);
    document.getElementById("orders-table").appendChild(newDiv);
}

function initialize(){
    createOrder({
        customer: "Ronak Kothari",
        product: "Clay Pots",
        quantity: 2,
        price: "144.99",
        checkpoints: {
            placed: "11/26/2023",
            shipped: "11/27/2023",
            delivery: "11/29/2023",
            received: "12/01/2023"
        }
    });

    createOrder({
        customer: "Jyot Kumar",
        product: "Stainless Steel Pots",
        quantity: 12,
        price: "57.99",
        checkpoints: {
            placed: "12/07/2023",
            shipped: "12/08/2023",
            delivery: "12/10/2023",
            refunded: "12/12/2023"
        }
    });

    createOrder({
        customer: "Rupali Khot",
        product: "Miniature Clay Pots",
        quantity: 24,
        price: "28.99",
        checkpoints: {
            placed: "12/07/2023",
            shipped: "12/08/2023",
            delivery: "12/10/2023",
            cancelled: "12/12/2023"
        }
    });

    createOrder({
        customer: "Ronak Kothari",
        product: "Clay Pots",
        quantity: 4,
        price: "288.99",
        checkpoints: {
            placed: "12/07/2023",
            shipped: "12/08/2023",
            delivery: "12/10/2023",
            received: "12/12/2023"
        }
    });

    createOrder({
        customer: "Shrihun Sankepally",
        product: "Miniature Clay Pots",
        quantity: 24,
        price: "28.99",
        checkpoints: {
            placed: "12/07/2023",
            shipped: "12/08/2023",
            delivery: "12/10/2023"
        }
    });
}

initialize();