// Function to encrypt a message
function encryptMessage(message, secretKey) {
    return CryptoJS.AES.encrypt(message, secretKey).toString();
}

// Function to decrypt a message
function decryptMessage(encryptedMessage, secretKey) {
    var bytes  = CryptoJS.AES.decrypt(encryptedMessage, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

console.log(btoa("youjee123"))

document.getElementById("sign-in-button").onclick = function(){
    if(atob("cmsucm9uYWtqa290aGFyaUBnbWFpbC5jb20=") === document.getElementById("email-input").value){
        if(document.getElementById("password-input").value == atob("eW91amVlMTIz")){
            console.log("logged in");
            return;
        }
    } console.log("incorrect");
}