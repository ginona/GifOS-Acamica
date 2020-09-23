const inputText = document.getElementById('search-txt')
const inputTextHeader = document.getElementById('search-txt-header')
// const divResult = document.getElementById('search-resultados');


async function getGifWithInput(text, pag){
    const apiURL = 'https://api.giphy.com/v1/gifs/search?api_key=TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs&q='+text+'&limit=12&offset='+pag+'&rating=g&lang=en';
    const response = await fetch(apiURL);
    const data = await response.json();
    return data
}

inputText.addEventListener('keyup', function(e){ 
    if(e.key === 'Enter'){
        const q = inputText.value;
        showingViewResults(q);
    }
 })

 inputTextHeader.addEventListener('keyup', function(e){ 
    if(e.key === 'Enter'){
        const q = inputTextHeader.value;
        showingViewResults(q);
    }
 })

async function searchGifsFn(text, pag){
    const divResult = document.getElementById('gifs-container');
    let searchResults = await getGifWithInput(text, pag);
    let resultHTML1 = '';
    searchResults.data.forEach(obj => {
         const url = obj.images.fixed_width.url
         const width = obj.images.fixed_width.width
         const height = obj.images.fixed_width.height
         resultHTML1 += `<div class="slick-search">
         <img src="${url}" alt="${obj.title}">
         <div class="card">
         <div class="group-icons">
             <div id="${obj.id}-remove" class="icons icon-delete"></div>
             <div id="${obj.id}-add" class="icons icon-heart"></div>
             <div id="${obj.id}-download" class="icons icon-download"></div>
             <div id="${obj.id}-max" class="icons icon-max"></div>
         </div>
         <div class="text-card">
             <div class="text-card-user">${obj.username !== '' ? obj.username : 'User' }</div>
             <h3 class="text-card-title">${obj.title}</h3>
        </div>
         </div>
     </div>`;
     })

         divResult.insertAdjacentHTML('beforeend', resultHTML1)


    trtrending2(searchResults);

}

function addToLS2(name,value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : [];
    existing.push(value);
    localStorage.setItem(name,JSON.stringify(existing)); 
}

function addFavourites2(gif) {
    document.getElementById(`${gif.id}-add`).classList.add('icon-heart--active')
    addToLS('Favourites',gif)
}

async function downloadFavourites2(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}
function removeFavourites2(gif) {
    let data = JSON.parse(localStorage.getItem('Favorites'))
    data.forEach((ítem,index) => ítem.id === gif.id ? data.splice(index,1): null)
    localStorage.setItem('Favorites',JSON.stringify(data))
    document.getElementById(gif.id).remove()
}

function events2(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-remove`){
            removeFavourites2(gif);
        }
        if (e.currentTarget.id == `${gif.id}-add`){
            addFavourites2(gif);
        }
        if (e.currentTarget.id == `${gif.id}-download`){
            downloadFavourites2(gif);
        }
        if (e.currentTarget.id == `${gif.id}-max`){
            searchById(gif.id);
        }
    };
    const handlerEventsForEacrhIcon = document.querySelectorAll(".icons");
    handlerEventsForEacrhIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    }) 
}

function trtrending2(data){
    data.data.map(function(gif){ let card =  events2(gif)
        return card;
    }).join('');
}


function showSearch(){
    let input = window.matchMedia("(min-width: 800px)");
    let y = window.scrollY;
    if(input.matches && y!== 0){
        document.getElementById("hideSearch").style.display="block";
    }else{
        document.getElementById("hideSearch").style.display="none";
    }
}
window.addEventListener("scroll", showSearch);