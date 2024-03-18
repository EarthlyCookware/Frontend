let orderNumber;

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function reorganizeDates(obj) {
    return Object.entries(obj)
        .sort((a, b) => new Date(a[1]) - new Date(b[1]))
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});
}

async function createOrder(id, args){
    orderNumber++;
    const newDiv = document.createElement("div");
    newDiv.classList.add("orders-table-row");

    const numberPara = document.createElement("p");
    numberPara.innerHTML = orderNumber;
    numberPara.classList.add("orders-table-number");

    const customerName = document.createElement("p");
    customerName.innerHTML = args.customer;

    const orderProductContainer = document.createElement("div");

    for(let i = 0; i < args.products.length; i++) {
        const orderProduct = document.createElement("h1");
        const orderQuantity = document.createElement("p");

        orderProduct.innerHTML = args.products[i][0];
        orderQuantity.innerHTML = `QTY: ${args.products[i][1]}`;

        orderProductContainer.append(orderProduct, orderQuantity);
    }

    orderProductContainer.classList.add("orders-table-row-product");

    const orderStatusContainer = document.createElement("p");
    const orderStatus = document.createElement("span");

    orderStatus.classList.add("order-status");

    args.checkpoints = reorganizeDates(args.checkpoints)

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

    //console.log(Object.keys(args.checkpoints));

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
        ["shipping", "Mark Shipping"],
        ["delivery", "Mark Out For Delivery"],
        //["edit", "Edit Order"],
        //["message", "Message Customer"],
        ["check", "Mark as Received"],
        ["refund", "Refund Order"],
        ["delete", "Cancel Order"],
    ];

    contextMenuElements.forEach((element, index) => {
        const contextMenuElement = document.createElement("div");

        const contextMenuImg = document.createElement("img");
        const contextMenuP = document.createElement("p");

        contextMenuImg.src = `../icons/${element[0]}.png`;
        contextMenuP.innerHTML = element[1];

        if(element[0] === "shipping"){
            contextMenuElement.addEventListener("click", async function(e){
                e.preventDefault();

                if(orderStatus.classList.contains("refunded")) return;
                if(orderStatus.classList.contains("cancelled")) return;

                await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/shipOrder/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PATCH',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                });

                await initialize();
            })
        } else if(element[0] === "delivery"){
            contextMenuElement.addEventListener("click", async function(e){
                e.preventDefault();

                if(orderStatus.classList.contains("refunded")) return;
                if(orderStatus.classList.contains("cancelled")) return;

                await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/deliverOrder/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PATCH',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                });

                await initialize();
            })
        } else if(element[0] === "check"){
            contextMenuElement.addEventListener("click", async function(e){
                e.preventDefault();

                if(orderStatus.classList.contains("refunded")) return;
                if(orderStatus.classList.contains("cancelled")) return;

                await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/receiveOrder/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PATCH',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                });

                await initialize();
            })
        } else if(element[0] === "refund"){
            contextMenuElement.addEventListener("click", async function(e){
                e.preventDefault();

                if(orderStatus.classList.contains("refunded")) return;
                if(orderStatus.classList.contains("cancelled")) return;

                await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/refundOrder/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PATCH',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                });

                await initialize();
            })
        } else if(element[0] === "delete"){
            contextMenuElement.addEventListener("click", async function(e){
                e.preventDefault();

                if(orderStatus.classList.contains("cancelled")) return;

                await fetch(`https://us-central1-ancientearth-cookware.cloudfunctions.net/app/cancelOrder/${id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'DELETE, POST, GET, OPTIONS, PATCH',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    mode: 'cors'
                });

                await initialize();
            })
        }

        contextMenuElement.append(contextMenuImg, contextMenuP);
        orderContextMenu.appendChild(contextMenuElement);
    });

    orderContextContainer.append(orderContextImg, orderContextMenu);

    newDiv.append(numberPara, customerName, orderProductContainer, orderStatusContainer, orderPrice, orderCheckpoints, orderContextContainer);
    document.getElementById("orders-table").appendChild(newDiv);
}

async function initialize(){
    orderNumber = 0;

    document.querySelectorAll('#orders-table > *').forEach(element => {
        if(element.id !== 'orders-table-legend') {
            element.remove();
        }
    });

    const response = await fetch("https://us-central1-ancientearth-cookware.cloudfunctions.net/app/getOrders", {
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
        try{
            await createOrder(Object.keys(context)[i], Object.values(context)[i]);
        } catch (e) {
            console.error(e);
        }
    }
}

window.onload = async function(){
    await initialize();
}