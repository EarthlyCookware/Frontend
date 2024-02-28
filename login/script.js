document.getElementById("sign-in-button").onclick = function(){
    if(atob("cmsucm9uYWtqa290aGFyaUBnbWFpbC5jb20=") === document.getElementById("email-input").value){
        if(document.getElementById("password-input").value === atob("eW91amVlMTIz")){
            localStorage.setItem("loggedIn", JSON.stringify(true));

            location.href = "../admin/dashboard";
            return;
        }
    } console.log("incorrect");
}