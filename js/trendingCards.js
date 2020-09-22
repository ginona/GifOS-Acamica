// import MaxGif from '../js/maxGif.js'

const buttonPrev = document.getElementById('button-prev');
const buttonNext = document.getElementById('button-next');
const track = document.getElementById('track');
const slickList = document.getElementById('slick-list');
const slick = document.querySelectorAll('.slick');

const slickWidth = 275;


buttonPrev.onclick = () => Move(1);
buttonNext.onclick = () => Move(2);


function Move(value){

    let carrousel =  document.getElementById('slick-list');
    const trackWidth = track.offsetWidth;
    const listWidth = slickList.offsetWidth;

    track.style.left == "" ? leftPosition = track.style.left = 0 : leftPosition = parseFloat(track.style.left.slice(0, -2) * -1);

    if(leftPosition < (trackWidth - listWidth) && value == 2){
        track.style.left = `${-1 * (leftPosition + 275)}px`;
        carrousel.scroll(track.style.left,0)
        return;
    }else if(leftPosition > 0  && value == 1){
        track.style.left = `${-1 * (leftPosition - 275)}px`
        carrousel.scroll(track.style.left,0)
    }
}

const resultsEl = document.getElementById('track')

function search(data){
    let resultHTML = '';
    data.data.forEach(obj => {
         const url = obj.images.fixed_width.url


         resultHTML += `<div class="slick">
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

     resultsEl.innerHTML = resultHTML
}

async function getGif(){
    const API_KEY = 'TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs'
    const API = 'https://api.giphy.com/v1/gifs/trending'; 

    const apiURL = API+'?api_key='+API_KEY+'&limit=12&rating=g';

    const response = await fetch(apiURL);
    const data = await response.json();
    search(data);
    trtrending(data);
}

getGif()


   function addToLS(name,value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : [];
    existing.push(value);
    localStorage.setItem(name,JSON.stringify(existing)); 
}

function addFavourites(gif) {
    document.getElementById(`${gif.id}-add`).classList.add('icon-heart--active')
    addToLS('Favourites',gif)
}

async function downloadFavourites(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

function removeFavourites(gif) {
    let data = JSON.parse(localStorage.getItem('Favorites'))
    data.forEach((ítem,index) => ítem.id === gif.id ? data.splice(index,1): null)
    localStorage.setItem('Favorites',JSON.stringify(data))
    document.getElementById(gif.id).remove()
}

function events(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-remove`){
            removeFavourites(gif);
        }
        if (e.currentTarget.id == `${gif.id}-add`){
            addFavourites(gif);
        }
        if (e.currentTarget.id == `${gif.id}-download`){
            downloadFavourites(gif);
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

function trtrending(data){
    data.data.map(function(gif){ let card =  events(gif)
        return card;
    }).join('');
}