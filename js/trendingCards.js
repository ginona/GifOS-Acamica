const buttonPrev = document.getElementById('button-prev');
const buttonNext = document.getElementById('button-next');
const track = document.getElementById('track');
const slickList = document.getElementById('slick-list');
const slick = document.querySelectorAll('.slick');




async function getGif(){
    try {
        const response = await fetch('/api/giphy?endpoint=gifs/trending&limit=12&rating=g');
        const data = await response.json();
        showGif(data);
        trTrending(data);
    } catch (error) {
        console.error('Error fetching trending GIFs:', error);
    }
}

getGif()


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

function showGif(data){
    let resultHTML = '';
    data.data.forEach(obj => {
         const url = obj.images.fixed_width.url


         resultHTML += `<div class="slick" id="${obj.id}">
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

     resultsEl.innerHTML = resultHTML
}


function addToLS(name,value) {
    let extng = localStorage.getItem(name);
    extng = extng ? JSON.parse(extng) : [];
    extng.push(value);
    localStorage.setItem(name,JSON.stringify(extng)); 
}

function addToFavs(gif) {
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

function rmMisGifos(gif) {
    let data = JSON.parse(localStorage.getItem('MyGifs'))
    data.forEach((item,index) => item === gif.id ? data.splice(index,1): null)
    localStorage.setItem('MyGifs',JSON.stringify(data))
    location.reload()
}

function eventsTrending(gif){
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

function eventsTrendingFav(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-add`){
            rmFavourites(gif);
            location.reload();
        }
        if (e.currentTarget.id == `${gif.id}-download`){
            downloadFavs(gif);
        }
        if (e.currentTarget.id == `${gif.id}-max`){
            searchByIdFav(gif.id);
        }
    };
    const handlerEventsForEachIcon = document.querySelectorAll(".icons-fav");
    handlerEventsForEachIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    })
    const cardMaxonMobile = document.getElementById(gif.id);
    cardMaxonMobile.addEventListener("click",function(){
        if(isMobile()){
            searchByIdFav(gif.id);
        }
    }) 
}

function eventsTrendingDelete(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-delete`){
            rmMisGifos(gif);
        }
        if (e.currentTarget.id == `${gif.id}-download`){
            downloadFavs(gif);
        }
        if (e.currentTarget.id == `${gif.id}-max`){
            searchByIdDelete(gif.id);
        }
    };
    const handlerEventsForEachIcon = document.querySelectorAll(".icons-delete");
    handlerEventsForEachIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    })
    const cardMaxonMobile = document.getElementById(gif.id);
    cardMaxonMobile.addEventListener("click",function(){
        if(isMobile()){
            searchByIdDelete(gif.id);
        }
    }) 
}


function addToFavsFav(gif) {
    if(document.getElementById(`${gif.id}-add`).classList.contains('icon-heart--active') == false)
    {
        document.getElementById(`${gif.id}-add`).classList.add('icon-heart--active')
        addToLS('Favourites',gif)
    }else{
        document.getElementById(`${gif.id}-add`).classList.remove('icon-heart--active')
        document.getElementById(`${gif.id}-add`).classList.add('icon-heart')
        rmFavourites(gif);
    }
}

function isMobile(){
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
}

function trTrending(data){
    data.data.map(function(gif){ let card =  eventsTrending(gif)
        return card;
    }).join('');
}

async function searchById(id) {
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

function addFavMax(gif) {
    let elementMax = document.getElementById(`${gif.id}-add-max-gif`)

    if(elementMax.classList.contains('icon-heart--active') == false){
        elementMax.classList.add('icon-heart--active')
        addToLS('Favourites',gif)
    }else{
        elementMax.classList.remove('icon-heart--active')
        rmFavourites(gif)
    }
}

async function downloadFavMax(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}

export async function searchByIdFav(id) {
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

async function searchByIdDelete(id) {
    try {
        const response = await fetch(`/api/giphy?endpoint=gifs/${id}`);
        const data = await response.json();
        if (data.data) {
            const modal = document.getElementById('modalDelete');
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
                            <div id="${data.data.id}-delete" class="icons icon-delete"></div>
                            <div id="${data.data.id}-download-max-gif" class="icons icon-download"></div>
                        </div>
                    </div>
                </div>
            </div>`;

            modal.querySelector('.modal-content').innerHTML = resultHTML;
            modal.style.display = 'block';
            eventsMaxGifDelete(data.data);
        }
    } catch (error) {
        console.error('Error fetching GIF by ID:', error);
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Add click event listener to close modal when clicking outside
document.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            closeModal();
        }
    });
});