var modal = document.getElementById("modal")

// var crossBtn = document.getElementById("cierreModal")

// crossBtn.addEventListener('click', closeModal)


function closeModal(){
    modal.style.display = 'none';
}


async function searchById(gifId){
    const api_url = 'https://api.giphy.com/v1/gifs/'+gifId+'?api_key=TwJ1SaQHCIBd0qczJHRc3ioNpKdTxEYs';

    const response = await fetch(api_url);
    const data = await response.json();
    searchByIdAndLoad(data)
    eventsMaxGif(data)
}

async function searchByIdAndLoad(gifWithId){
    let resultHTML = '';
         const url = gifWithId.data.images.fixed_width.url

        resultHTML += `<div class="cross" onclick="closeModal()">X</div>
        <div class="container">
            <div class="max-image-text">
                <div class="image-max">
                    <img src="${url}" alt="${gifWithId.data.title}">
                </div>
                <div class="icon-text">
                    <div class="max-text">
                        <div class="text-card-user">${gifWithId.data.username !== '' ? gifWithId.data.username : 'User' }</div>
                        <h3 class="text-card-title">${gifWithId.data.title}</h3>
                    </div>
                    <div class="iconos">
                    <div id="${gifWithId.data.id}-add-max-gif" class="icons icon-heart"></div>
                    <div id="${gifWithId.data.id}-download-max-gif" class="icons icon-download"></div>
                    </div>
                </div>
            </div>
        </div>`;

     modal.innerHTML = resultHTML
     modal.style.display = 'block';
}


function addToLSMaxGif(name,value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : [];
    existing.push(value);
    localStorage.setItem(name,JSON.stringify(existing)); 
}


function addFavMax(gif) {
    let elementMax = document.getElementById(`${gif.data.id}-add-max-gif`)

    if(elementMax.classList.contains('icon-heart--active') == false){
        elementMax.classList.add('icon-heart--active')
        addToLSMaxGif('Favourites',gif)
    }else{
        elementMax.classList.remove('icon-heart--active')
        rmFavMax(gif)
    }

}

async function downloadFavMax(gif){
    let a = document.createElement('a');
    let response = await fetch(`${gif.data.images.downsized.url}`);
    let file = await response.blob();
    a.download = `${gif.data.title}`;
    a.href = window.URL.createObjectURL(file);
    a.dataset.downloadurl = ['application/octet-stream', a.download, a.href].join(':');
    a.click();
}
function rmFavMax(gif) {
    let data = JSON.parse(localStorage.getItem('Favourites'))
    data.forEach((ítem,index) => ítem.id === gif.id ? data.splice(index,1): null)
    localStorage.setItem('Favourites',JSON.stringify(data))
}

function eventsMaxGif(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.data.id}-add-max-gif`){
            addFavMax(gif);
        }
        if (e.currentTarget.id == `${gif.data.id}-download-max-gif`){
            downloadFavMax(gif)
        }
    };
    const handlerEventsForEacrhIcon = document.querySelectorAll(".icons");
    handlerEventsForEacrhIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    }) 
}
