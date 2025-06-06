const inputText = document.getElementById('search-txt')
const inputTextHeader = document.getElementById('search-txt-header')
const inputLens = document.getElementById('search-btn')
const inputLensHeader = document.getElementById('search-btn-header')

/* async function getGifWithInput(text, pag){
    const apiURL = `/api/giphy?endpoint=search&q=${text}&limit=12&offset=${pag}&rating=g&lang=en`;
    const response = await fetch(apiURL);
    const data = await response.json();
    return data
} */

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

inputLens.addEventListener('click', function(){
    showingViewResults(inputText.value)
})

inputLensHeader.addEventListener('click', function(){
    showingViewResults(inputTextHeader.value)
})

export async function searchGifsFn(text, pag){
    const divResult = document.getElementById('gifs-container');
    if (!divResult) {
        console.error('GIFs container not found');
        return;
    }

    let searchResults = await getGifWithInput(text, pag);
    let resultHTML1 = '';
    
    if (searchResults && searchResults.data && searchResults.data.length > 0) {
        searchResults.data.forEach(obj => {
            const url = obj.images.fixed_width.url;
            resultHTML1 += `<div class="slick-search" id="${obj.id}">
                <img src="${url}" alt="${obj.title}">
                <div class="card">
                    <div class="group-icons">
                        <div id="${obj.id}-add" class="icons icon-heart"></div>
                        <div id="${obj.id}-download" class="icons icon-download"></div>
                        <div id="${obj.id}-max" class="icons icon-max"></div>
                    </div>
                    <div class="text-card">
                        <div class="text-card-user">${obj.username !== '' ? obj.username : 'User'}</div>
                        <h3 class="text-card-title">${obj.title}</h3>
                    </div>
                </div>
            </div>`;
        });

        divResult.insertAdjacentHTML('beforeend', resultHTML1);
        trTrending(searchResults);
    }
}

async function getTextTrending() {
    try {
        const response = await fetch('/api/giphy?endpoint=trending/searches');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching text GIFs:', error);
    }
}

async function setTrendingText(){
    let trends = await getTextTrending();
    let trendLocation = document.getElementById('random-trend');
    trendLocation.innerHTML = '';
    for(let i = 0; i < 5; i++){
        trendLocation.innerHTML += `<div class="trend-text-search">${trends.data[i]}</div>`;
    }
    try {
        const trendTexts = document.querySelectorAll('.trend-text-search');
        trendTexts.forEach(text => {
            text.addEventListener('click', function(){
                showingViewResults(this.textContent);
            });
        });
    } catch (error) {
        console.error('Error setting trending text:', error);
    }
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
    if(y!== 0){
        document.querySelector('.header').style.boxShadow = '1px 1px 4px 0 rgba(0, 0, 0, .1)'
    }else{
        document.querySelector('.header').style.boxShadow = 'none'
    }
}
window.addEventListener("scroll", showSearch)

export function trTrending(data){
    data.data.map(function(gif){ 
        let card = eventsTrending(gif)
        return card;
    }).join('');
}

export function eventsTrending(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-add`){
            addToFavs(gif);
        }
        if (e.currentTarget.id == `${gif.id}-download`){
            downloadFavs(gif);
        }
        if (e.currentTarget.id == `${gif.id}-max`){
            searchById(gif.id);
        }
    };
    const handlerEventsForEachIcon = document.querySelectorAll(".icons");
    handlerEventsForEachIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    })
    const cardMaxonMobile = document.getElementById(gif.id);
    cardMaxonMobile.addEventListener("click",function(){
        if(isMobile()){
            searchById(gif.id);
        }
    }) 
}

export function addToFavs(gif) {
    if(document.getElementById(`${gif.id}-add`).classList.contains('icon-heart--active') == false)
    {
        document.getElementById(`${gif.id}-add`).classList.add('icon-heart--active')
        addToLS('Favourites',gif)
    }else{
        document.getElementById(`${gif.id}-add`).classList.remove('icon-heart--active')
        rmFavourites(gif);
    }
}

export async function downloadFavs(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

export function rmFavourites(gif) {
    let data = JSON.parse(localStorage.getItem('Favourites'))
    data.forEach((item,index) => item.id === gif.id ? data.splice(index,1): null)
    localStorage.setItem('Favourites',JSON.stringify(data))
}

export function isMobile() {
    return window.innerWidth <= 800;
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

export function addFavMax(gif) {
    let elementMax = document.getElementById(`${gif.id}-add-max-gif`)

    if(elementMax.classList.contains('icon-heart--active') == false){
        elementMax.classList.add('icon-heart--active')
        addToLS('Favourites',gif)
    }else{
        elementMax.classList.remove('icon-heart--active')
        rmFavourites(gif)
    }
}

export async function downloadFavMax(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

export function addToLS(key, value) {
    let data = JSON.parse(localStorage.getItem(key)) || [];
    data.push(value);
    localStorage.setItem(key, JSON.stringify(data));
}