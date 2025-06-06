import { rmFavourites, downloadFavs, searchByIdFav } from './trendingCards.js';

const noResultContainer = document.getElementById('error-result-fav')

function getFavouriteCards(gifos) {
    if(gifos == null || gifos.length < 1){
        noResultContainer.innerHTML = '<div class="image-no-fav"><img src="./img/icon-fav-sin-contenido.svg" alt="no-content-favs"></div><br><br><p>Save your first GIFO!</p>'
    }else{
        gifos.map(function(gif){
            showingFav(gifos)
        })
    }
}

async function showingFav(gif) {
    let giftSection = document.getElementById('gifFav');
    const divResultado = document.getElementById('search-resultados');
    const viewGifs = `
        <div id="gifs-container" class="gifs-container gifs-container-search-results">           
        </div><br>
            <div id="more-results-favs" class="button-suggestion">
            See more
        </div> 
    `;

    giftSection.innerHTML = viewGifs
    searchGifsFnFav(gif)
}

getFavouriteCards()

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
                <div id="${searchResults[i].id}-add" class="icons-fav icon-delete"></div>
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
                <div id="${searchResults[i].id}-add" class="icons-fav icon-delete"></div>
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
                <div id="${searchResults[i].id}-add" class="icons-fav icon-delete"></div>
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

    divResult.innerHTML = resultHTML1;

    for(let j = 0; j<searchResults.length; j++) {
        const gif = searchResults[j];
        const deleteBtn = document.getElementById(`${gif.id}-add`);
        const downloadBtn = document.getElementById(`${gif.id}-download`);
        const maxBtn = document.getElementById(`${gif.id}-max`);

        if(deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                rmFavourites(gif);
                location.reload();
            });
        }

        if(downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                downloadFavs(gif);
            });
        }

        if(maxBtn) {
            maxBtn.addEventListener('click', () => {
                searchByIdFav(gif.id);
            });
        }
    }

    const moreResultsBtn = document.getElementById('more-results-favs');
    if(moreResultsBtn) {
        moreResultsBtn.addEventListener('click', function(){
            var notDisplayed = document.querySelectorAll('.noneDisplayedFavs');
            var cutted = Array.from(notDisplayed).slice(0, 12);
            cutted.forEach(element => {
                element.classList.remove('noneDisplayedFavs');
            });
            if (notDisplayed.length <= 12) {
                moreResultsBtn.classList.add('noneDisplayedFavs');
            }
        });
    }
}

function showSearch(){
    let y = window.scrollY
    if(y!== 0){
        document.querySelector('.header').style.boxShadow = '1px 1px 4px 0 rgba(0, 0, 0, .1)'
    }else{
        document.querySelector('.header').style.boxShadow = 'none'
    }
}
window.addEventListener("scroll", showSearch)


