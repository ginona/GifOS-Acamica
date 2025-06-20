var modal = document.getElementById("modalDelete")


function closeModal(){
    modal.style.display = 'none';
}

async function getGifById(id) {
    try {
        const response = await fetch(`/api/giphy?endpoint=gifs/${id}`);
        const data = await response.json();
        if (data.data) {
            showGifDetails(data.data);
        }
    } catch (error) {
        console.error('Error fetching GIF by ID:', error);
    }
}

async function searchByIdDelete(gifId){
    const api_url = `${import.meta.env.VITE_GIPHY_BASE_URL}/${gifId}?api_key=${import.meta.env.VITE_GIPHY_API_KEY}`;
    try{
        const response = await fetch(api_url);
        const data = await response.json();
        searchByIdAndLoadDelete(data)
        eventsMaxGifDelete(data.data)
    }catch(error){
        console.log('Error', error);
    }
}

async function searchByIdAndLoadDelete(gifWithId){
    let resultHTML = '';
    const url = gifWithId.data.images.fixed_width.url;

    resultHTML += `<div class="cross" onclick="closeModal()">X</div>
    <div class="container">
        <div class="max-image-text">
            <div class="image-max">
                <img src="${url}" alt="${gifWithId.data.title}">
            </div>
            <div class="icon-text">
                <div class="max-text">
                    <div class="text-card-user">${gifWithId.data.username !== '' ? gifWithId.data.username : 'User'}</div>
                    <h3 class="text-card-title">${gifWithId.data.title}</h3>
                </div>
                <div class="iconos">
                    <div id="${gifWithId.data.id}-delete" class="icons icon-delete"></div>
                    <div id="${gifWithId.data.id}-download-max-gif" class="icons icon-download"></div>
                </div>
            </div>
        </div>
    </div>`;

    const modal = document.getElementById('modal');
    modal.innerHTML = resultHTML;
    modal.style.display = 'block';

    // Add event listeners
    const deleteButton = document.getElementById(`${gifWithId.data.id}-delete`);
    const downloadButton = document.getElementById(`${gifWithId.data.id}-download-max-gif`);

    deleteButton.addEventListener('click', () => rmMisGifos(gifWithId.data));
    downloadButton.addEventListener('click', () => downloadFavMax(gifWithId.data));
}

function addToLSMaxGifDelete(name,value) {
    let existing = localStorage.getItem(name);
    existing = existing ? JSON.parse(existing) : [];
    existing.push(value);
    localStorage.setItem(name,JSON.stringify(existing)); 
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

function rmMaxDelete(gif) {
    let data = JSON.parse(localStorage.getItem('MyGifs'))
    data.forEach((item,index) => item === gif.id ? data.splice(index,1): null)
    localStorage.setItem('MyGifs',JSON.stringify(data))
}

function eventsMaxGifDelete(gif){
    const toggleEvent = e => {
        if (e.currentTarget.id == `${gif.id}-delete`){
            rmMaxDelete(gif);
            closeModal();
        }
        if (e.currentTarget.id == `${gif.id}-download-max-gif`){
            downloadFavMax(gif)
        }
    };
    const handlerEventsForEacrhIcon = document.querySelectorAll(".icons");
    handlerEventsForEacrhIcon.forEach( btn => {
        btn.addEventListener("click",toggleEvent)
    }) 
}

// Add click event listener to close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modal');
    if (e.target === modal) {
        closeModal();
    }
});
