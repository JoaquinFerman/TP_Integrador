function continuar(){
    const username = document.getElementById('nameInput').value
    if(!username){
        alert("Enter a valid name")
        return
    }
    localStorage.setItem('username', username);
    window.location.href = 'pages/cataloge.html';
}