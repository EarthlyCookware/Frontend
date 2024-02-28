function initialize(){
    let loggedIn;

    try {
        loggedIn = JSON.parse(localStorage.getItem("loggedIn"));
    } catch (e) {
        location.href = "../../login";
    }

    if(!loggedIn) location.href = "../../login";

} initialize();