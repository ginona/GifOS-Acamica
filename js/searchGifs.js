const inputText = document.getElementById('search-txt')
const inputTextHeader = document.getElementById('search-txt-header')
const inputLens = document.getElementById('search-btn')
const inputLensHeader = document.getElementById('search-btn-header')

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
    console.log(e.key)
 })

 inputTextHeader.addEventListener('keyup', function(e){ 
    if(e.key === 'Enter'){
        const q = inputTextHeader.value;
        showingViewResults(q);
    }
 })

 inputLens.addEventListener('click', function(){
    showingViewResults(inputText.value)
 })

 inputLensHeader.addEventListener('click', function(){
    showingViewResults(inputTextHeader.value)
 })

async function searchGifsFn(text, pag){
    const divResult = document.getElementById('gifs-container');
    let searchResults = await getGifWithInput(text, pag);
    let resultHTML1 = '';
    searchResults.data.forEach(obj => {
         const url = obj.images.fixed_width.url

         resultHTML1 += `<div class="slick-search" id="${obj.id}">
         <img src="${url}" alt="${obj.title}">
         <div class="card">
         <div class="group-icons">
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


         trTrending(searchResults);

}


const getTextTrending = async () => {
    const apiURL = 'https://api.giphy.com/v1/trending/searches?api_key=TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs'
    try{
        const response = await fetch(apiURL)
        const data = await response.json();
        return data;
    }catch (error) {
        console.log('Fetch Error',error);
    }
}

async function setTrendingText(){
    let trends = await getTextTrending();
    let trendLocation = document.getElementById("random-trend")
    trendLocation. innerHTML = ''

    for(let i = 0; i < 5; i++){
        trendLocation.innerHTML += '<div class="trend-text-searched noSpace">'+trends.data[i]+','+'</div>'
    }
    let trText = document.querySelectorAll('.trend-text-searched')
    trText.forEach(div => div.addEventListener('click', e =>{
        let str = e.currentTarget.textContent.substring(0, e.currentTarget.textContent.length - 1);
        showingViewResults(str)
    }))
}

setTrendingText()

function showSearch(){
    let input = window.matchMedia("(min-width: 800px)")
    let y = window.scrollY
    if(input.matches && y!== 0){
        document.getElementById("hideSearch").style.display="block"
        document.querySelector('.header').style.boxShadow = '1px 1px 4px 0 rgba(0, 0, 0, .1)'
    }else{
        document.getElementById("hideSearch").style.display="none"
        document.querySelector('.header').style.boxShadow = 'none'
    }
}
window.addEventListener("scroll", showSearch)