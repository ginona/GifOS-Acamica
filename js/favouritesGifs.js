const noResultContainer = document.getElementById('error-result-fav')

function getFavouriteCards() {
    // const favouriteContent = document.getElementById('favorite-gifs');
    const data = JSON.parse(localStorage.getItem('Favourites'))
    // console.log(data)

    if(data == null){
        // console.log(1)
        noResultContainer.innerHTML = '<img src="./img/icon-fav-sin-contenido.svg" alt="no-content-favs"><br><br><p>¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!</p>'
    }
     else{
        data.map(function(gif) {
            showingFavs(data)
        })
     }   
    // )
    
}
getFavouriteCards()


async function showingFavs(gif) {
    // let searchResults = await getGifWithInput(textSearch);
    let giftSection = document.getElementById('gifFav');
    const divResultado = document.getElementById('search-resultados');
    const viewGifs = `
        <div id="gifs-container" class="gifs-container gifs-container-search-results">           
        </div><br>
        <div id="more-results" class="button-suggestion">
            Ver más
        </div> 
    `;
        giftSection.innerHTML = viewGifs
        // console.log(gif)
        searchGifsFnFav(gif)
        // let moreResults = document.getElementById('more-results')
        // moreResults.addEventListener("click", function(){
        //     searchMoreResults(textSearch);
        // })

    
  }


  async function searchGifsFnFav(searchResults){
    //   console.log(searchResults)
    const divResult = document.getElementById('gifs-container');
    // let searchResults = await getGifWithInput(text, pag);
    let resultHTML1 = '';
    // searchResults[0].data.forEach(obj => {

    for(let i = 0; i<searchResults.length; i++){
        // console.log(searchResults[i].data.images.fixed_width.url)

        const url = searchResults[i].data.images.fixed_width.url

        resultHTML1 += `<div class="slick-search" id="${searchResults[i].data.id}">
        <img src="${url}" alt="${searchResults[i].data.title}">
        <div class="card">
        <div class="group-icons">
            <div id="${searchResults[i].data.id}-remove" class="icons icon-delete"></div>
            <div id="${searchResults[i].data.id}-add" class="icons icon-heart"></div>
            <div id="${searchResults[i].data.id}-download" class="icons icon-download"></div>
            <div id="${searchResults[i].data.id}-max" class="icons icon-max"></div>
        </div>
        <div class="text-card">
            <div class="text-card-user">${searchResults[i].data.username !== '' ? searchResults[i].data.username : 'User' }</div>
            <h3 class="text-card-title">${searchResults[i].data.title}</h3>
       </div>
        </div>
    </div>`;

    }
         divResult.insertAdjacentHTML('beforeend', resultHTML1)


}
