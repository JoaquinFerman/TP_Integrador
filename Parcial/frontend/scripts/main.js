import {setupThemeToggle} from "./functions.js";

function continuar(){
    const username = document.getElementById('nameInput').value
    if(!username){
        alert("Enter a valid name")
        return
    }
    localStorage.setItem('username', username);
    window.location.href = 'pages/catalog.html';
}

document.getElementById('continuar-button').addEventListener('click', continuar);

setupThemeToggle();