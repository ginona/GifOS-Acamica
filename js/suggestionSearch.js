  const searchInput = document.querySelector('.search-txt');
  const suggestionsPanel = document.getElementById('suggestions');
  
function fnAutoComplete(){
  searchInput.addEventListener('keyup', async (event) =>{
      let sug = await getAutoComplete(searchInput.value);
      document.getElementById('search-btn').style.display = 'none'
      document.getElementById('clean-btn').style.display = 'block'
      if(searchInput.value == ''){
        document.getElementById('search-btn').style.display = 'block'
        document.getElementById('clean-btn').style.display = 'none'
      }
      suggestionsPanel.style.borderTop = "1px solid rgba(156, 175, 195 ,.5)";
      const view = `
        <ul class="suggestions">
            ${sug.data.map(item => `
                <li class="option-list"><i class="fa fa-search"></i>${item.name}</li>
            `).join('')}
        </ul>
        `;
        if(sug.data.length !== 0){
          suggestionsPanel.innerHTML = view
        }else{
          suggestionsPanel.innerHTML = ''
          suggestionsPanel.style.borderTop = "none";
        }

        const optionList = document.querySelectorAll(".option-list");
        optionList.forEach( li => li.addEventListener("click",searchGifoSuggested))
  })
}
fnAutoComplete()

document.getElementById('clean-btn').addEventListener('click', function(){
  document.getElementById('search-txt').value = ''
  document.getElementById('search-btn').style.display = 'block'
  document.getElementById('clean-btn').style.display = 'none'
})

 async function getAutoComplete(text){
    const url = 'https://api.giphy.com/v1/gifs/search/tags?api_key=TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs&q='+text;
    try{
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }catch(error){
      console.log('Error', error);
    }
  }

  const searchGifoSuggested = (e) => {
    let searchTitle = e.currentTarget.textContent
    let inputSearch = document.getElementById('search-txt');
    inputSearch.value = e.currentTarget.textContent;
    let list = document.getElementById('suggestions');
    list.innerHTML = '';
    showingViewResults(searchTitle);
}

let pag = 12 ;
async function searchMoreResults(textSearch) {
    pag = pag + 12;
    let gifsContainer = document.getElementById('gifs-container');
    searchGifsFn(textSearch, pag)
}


async function showingViewResults(textSearch) {
  let searchResults = await getGifWithInput(textSearch);
  let giftSection = document.getElementById('trend-text');
  const divResultado = document.getElementById('search-resultados');
  const viewGifs = `
      <h1 class="main-title">${textSearch}</h1>
      <div id="gifs-container" class="gifs-container gifs-container-search-results">           
      </div><br>
      <div id="more-results" class="button-suggestion">
          Ver más
      </div> 
  `;
  const viewNoResults = `
      <div class="center-no-result">
      <h1 class="main-title">${textSearch}</h1>
      </div><br>
      <div class="error-results">
          <img src="./img/icon-busqueda-sin-resultado.svg" alt="Busqueda-sin-resultados"><br><br>
          <p>Intenta con otra búsqueda.</p><br>
      </div>
  `;
  if( searchResults.data.length !== 0 ){
      giftSection.innerHTML = viewGifs
      searchGifsFn(textSearch, 0)
      let moreResults = document.getElementById('more-results')
      moreResults.addEventListener("click", function(){
          searchMoreResults(textSearch);
      })
  } else {
      giftSection.innerHTML = viewNoResults
  }
  
}