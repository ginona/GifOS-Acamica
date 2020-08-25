function darkMode(){
    let lista = document.getElementById("headerCompleto");
    let ulCompleto = document.getElementById("menu-ul");
    let cruzLineas = document.getElementById("nav-icon-id");
    lista.classList.toggle("headerCompleto");
    ulCompleto.classList.toggle("darkMode");
    cruzLineas.classList.toggle("navIcon");
}