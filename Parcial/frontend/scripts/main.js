import {setupThemeToggle} from "./functions.js";

function continueF(){
    const username = document.getElementById('nameInput').value
    if(!username){
        alert("Enter a valid name")
        return
    }
    localStorage.setItem('username', username);
    window.location.href = './pages/catalog.html';
}

document.getElementById('continue-button').addEventListener('click', continueF);

setupThemeToggle();