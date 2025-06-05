const noResultContainer = document.getElementById('error-result-mine-gif')

function getMineGifos(gifos) {
     
    if(gifos == null || gifos.length < 1){
        noResultContainer.innerHTML = '<div class="image-no-fav"><img src="./img/icon-fav-sin-contenido.svg" alt="no-content-favs"></div><br><br><p>¡Anímate a crear tu primer GIFO!</p>'
    }else{
        gifos.map(function(gif){
            showingMine(gifos)
        })
    }
}

async function getMyGifos(){
    let gifsData = []
    const gifsLS = JSON.parse(localStorage.getItem('MyGifs'))

    if(gifsLS){
        for (const iterator of gifsLS) {
            let id = await searchById(iterator);
            gifsData.push(id.data);
        }
    }else{
        gifsData = null
    }
    getMineGifos(gifsData)
}

getMyGifos()


async function searchById(gifId){
    const api_url = `${import.meta.env.VITE_GIPHY_BASE_URL}/${gifId}?api_key=${import.meta.env.VITE_GIPHY_API_KEY}`;
    try{
        const response = await fetch(api_url);
        const data = await response.json();
        searchByIdAndLoad(data)
        eventsMaxGif(data)
    }catch(error){
        console.log('Error', error);
    }
}

async function showingMine(gif) {
    let giftSection = document.getElementById('gifMine');
    const divResultado = document.getElementById('search-resultados');
    const viewGifs = `
        <div id="gifs-container" class="gifs-container gifs-container-search-results">           
        </div><br>
            <div id="more-results-mis-gifos" class="button-suggestion">
            Ver más
        </div> 
    `;

        giftSection.innerHTML = viewGifs
        searchGifsFnMine(gif)
    
  }


  async function searchGifsFnMine(searchResults){
  const divResult = document.getElementById('gifs-container');
  let resultHTML1 = '';
  if(searchResults.length<=12){
      for(let i = 0; i<searchResults.length; i++){
      

          const url = searchResults[i].images.fixed_width.url
  
          resultHTML1 += `<div class="slick-search" id="${searchResults[i].id}">
          <img src="${url}" alt="${searchResults[i].title}">
          <div class="card">
          <div class="group-icons">
              <div id="${searchResults[i].id}-delete" class="icons-delete icon-delete"></div>
              <div id="${searchResults[i].id}-download" class="icons-delete icon-download"></div>
              <div id="${searchResults[i].id}-max" class="icons-delete icon-max"></div>
          </div>
          <div class="text-card">
              <div class="text-card-user">${searchResults[i].username !== '' ? searchResults[i].username : 'User' }</div>
              <h3 class="text-card-title">${searchResults[i].title}</h3>
         </div>
          </div>
      </div>`;
          
      }
      document.getElementById('more-results-mis-gifos').classList.add('noneDisplayedFavs');
  }else{

    for(let i = 0; i<12; i++){
      

        const url = searchResults[i].images.fixed_width.url

        resultHTML1 += `<div class="slick-search" id="${searchResults[i].id}">
        <img src="${url}" alt="${searchResults[i].title}">
        <div class="card">
        <div class="group-icons">
            <div id="${searchResults[i].id}-delete" class="icons-delete icon-delete"></div>
            <div id="${searchResults[i].id}-download" class="icons-delete icon-download"></div>
            <div id="${searchResults[i].id}-max" class="icons-delete icon-max"></div>
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
              <div id="${searchResults[i].id}-delete" class="icons-delete icon-delete"></div>
              <div id="${searchResults[i].id}-download" class="icons-delete icon-download"></div>
              <div id="${searchResults[i].id}-max" class="icons-delete icon-max"></div>
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
          eventsTrendingDelete(searchResults[j])
       }

       document.getElementById('more-results-mis-gifos').addEventListener('click', function(){
          var notDisplayed = document.querySelectorAll('.noneDisplayedFavs');
          var cutted = Array.from(notDisplayed).slice(0, 12);
          cutted.forEach(element => {
              element.classList.remove('noneDisplayedFavs');
          });
          if (notDisplayed.length <= 12) {
              document.getElementById('more-results-mis-gifos').classList.add('noneDisplayedFavs');
          }
      })
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