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

async function getMyGifs() {
    try {
        const response = await fetch('/api/giphy?endpoint=gifs/my-gifs');
        const data = await response.json();
        if (data.data) {
            showMyGifs(data.data);
            setupEventListeners(data.data);
        }
    } catch (error) {
        console.error('Error fetching my GIFs:', error);
    }
}

getMyGifs()


async function searchById(gifId){
    try{
        const response = await fetch(`/api/giphy?endpoint=gifs/${gifId}`);
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

export async function getGifWithInput(text, pag) {
    try {
        const apiURL = `/api/giphy?endpoint=gifs/search&q=${encodeURIComponent(text)}&limit=12&offset=${pag}&rating=g&lang=en`;
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching search GIFs:', error);
        return { data: [] }; // Return empty data structure to prevent undefined errors
    }
}

export async function searchById(id) {
    try {
        const response = await fetch(`/api/giphy?endpoint=gifs/${id}`);
        const data = await response.json();
        if (data.data) {
            const modal = document.getElementById('modal');
            let resultHTML = '';
            const url = data.data.images.fixed_width.url;

            resultHTML += `<div class="cross" onclick="closeModal()">X</div>
            <div class="container">
                <div class="max-image-text">
                    <div class="image-max">
                        <img src="${url}" alt="${data.data.title}">
                    </div>
                    <div class="icon-text">
                        <div class="max-text">
                            <div class="text-card-user">${data.data.username !== '' ? data.data.username : 'User'}</div>
                            <h3 class="text-card-title">${data.data.title}</h3>
                        </div>
                        <div class="iconos">
                            <div id="${data.data.id}-add-max-gif" class="icons icon-heart"></div>
                            <div id="${data.data.id}-download-max-gif" class="icons icon-download"></div>
                        </div>
                    </div>
                </div>
            </div>`;

            modal.innerHTML = resultHTML;
            modal.style.display = 'block';

            // Add event listeners
            const favButton = document.getElementById(`${data.data.id}-add-max-gif`);
            const downloadButton = document.getElementById(`${data.data.id}-download-max-gif`);

            favButton.addEventListener('click', () => addFavMax(data.data));
            downloadButton.addEventListener('click', () => downloadFavMax(data.data));
        }
    } catch (error) {
        console.error('Error fetching GIF by ID:', error);
    }
}