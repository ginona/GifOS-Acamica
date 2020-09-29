const noResultContainer = document.getElementById('error-result-mine-gif')

function getMineGifos() {
    const data = JSON.parse(localStorage.getItem('MisGifos'))

    if(data == null || data.length < 1){
        noResultContainer.innerHTML = '<div class="image-no-fav"><img src="./img/icon-fav-sin-contenido.svg" alt="no-content-favs"></div><br><br><p>¡Anímate a crear tu primer GIFO!</p>'
    }  
    
}
getMineGifos()