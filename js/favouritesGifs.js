const noResultContainer = document.getElementById('error-result-fav')

function getFavouriteCards() {
    const data = JSON.parse(localStorage.getItem('Favourites'))

    if(data == null || data.length < 1){
        noResultContainer.innerHTML = '<div class="image-no-fav"><img src="./img/icon-fav-sin-contenido.svg" alt="no-content-favs"></div><br><br><p>¡Guarda tu primer GIFO en Favoritos para que se muestre aquí!</p>'
    }
     else{
        data.map(function(gif) {
            showingFavs(data)
        })
     }   
    
}
getFavouriteCards()


async function showingFavs(gif) {
    let giftSection = document.getElementById('gifFav');
    const divResultado = document.getElementById('search-resultados');
    const viewGifs = `
        <div id="gifs-container" class="gifs-container gifs-container-search-results">           
        </div><br>
            <div id="more-results-favs" class="button-suggestion">
            Ver más
        </div> 
    `;

        giftSection.innerHTML = viewGifs
        searchGifsFnFav(gif)
    
  }

  async function searchGifsFnFav(searchResults){
    const divResult = document.getElementById('gifs-container');
    let resultHTML1 = '';
    let bandera = 0
    if(searchResults.length<=12)
    {
        for(let i = 0; i<searchResults.length; i++){
        

            const url = searchResults[i].images.fixed_width.url
    
            resultHTML1 += `<div class="slick-search" id="${searchResults[i].id}">
            <img src="${url}" alt="${searchResults[i].title}">
            <div class="card">
            <div class="group-icons">
                <div id="${searchResults[i].id}-add" class="icons-fav icon-heart--active"></div>
                <div id="${searchResults[i].id}-download" class="icons-fav icon-download"></div>
                <div id="${searchResults[i].id}-max" class="icons-fav icon-max"></div>
            </div>
            <div class="text-card">
                <div class="text-card-user">${searchResults[i].username !== '' ? searchResults[i].username : 'User' }</div>
                <h3 class="text-card-title">${searchResults[i].title}</h3>
           </div>
            </div>
        </div>`;
            
        }
        document.getElementById('more-results-favs').classList.add('noneDisplayedFavs');
    }else{
        for(let i = 0; i<12; i++){
        

            const url = searchResults[i].images.fixed_width.url
    
            resultHTML1 += `<div class="slick-search" id="${searchResults[i].id}">
            <img src="${url}" alt="${searchResults[i].title}">
            <div class="card">
            <div class="group-icons">
                <div id="${searchResults[i].id}-add" class="icons-fav icon-heart--active"></div>
                <div id="${searchResults[i].id}-download" class="icons-fav icon-download"></div>
                <div id="${searchResults[i].id}-max" class="icons-fav icon-max"></div>
            </div>
            <div class="text-card">
                <div class="text-card-user">${searchResults[i].username !== '' ? searchResults[i].username : 'User' }</div>
                <h3 class="text-card-title">${searchResults[i].title}</h3>
           </div>
            </div>
        </div>`;
            
        }

        for(let i = 12; i<searchResults.length; i++){
            const url = searchResults[i].images.fixed_width.url
    
            resultHTML1 += `<div class="slick-search noneDisplayedFavs" id="${searchResults[i].id}">
            <img src="${url}" alt="${searchResults[i].title}">
            <div class="card">
            <div class="group-icons">
                <div id="${searchResults[i].id}-add" class="icons-fav icon-heart--active"></div>
                <div id="${searchResults[i].id}-download" class="icons-fav icon-download"></div>
                <div id="${searchResults[i].id}-max" class="icons-fav icon-max"></div>
            </div>
            <div class="text-card">
                <div class="text-card-user">${searchResults[i].username !== '' ? searchResults[i].username : 'User' }</div>
                <h3 class="text-card-title">${searchResults[i].title}</h3>
           </div>
            </div>
        </div>`;
            
        }
    }

        

         divResult.insertAdjacentHTML('beforeend', resultHTML1)

         for(let j = 0; j<searchResults.length; j++)
         {
            eventsTrendingFav(searchResults[j])
         }

         
        document.getElementById('more-results-favs').addEventListener('click', function(){
            var hiddenPNodes = document.querySelectorAll('.noneDisplayedFavs');
            var first3 = Array.from(hiddenPNodes).slice(0, 12);
            first3.forEach(element => {
                element.classList.remove('noneDisplayedFavs');
            });
            if (hiddenPNodes.length <= 12) {
                document.getElementById('more-results-favs').classList.add('noneDisplayedFavs')
            }
        })
}





