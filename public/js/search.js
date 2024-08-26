const list = document.querySelector('.list');
const main = document.querySelector('main');
const newSearchResults = document.querySelector('.searchResults');
const searchTitle = document.querySelector('.title');
const emptyList = document.querySelector('.empty-list');
const showResultTitles = document.querySelectorAll('.show-result-title')

if (searchResults.length === 0) {
    searchTitle.innerText = `Could not find results for '${searchTerm}'`;
    emptyList.classList.remove('hidden');
} else {
    searchTitle.innerText = `Showing results for '${searchTerm}'`;
    emptyList.classList.add('hidden');
}

let i = 0;
for (title of showResultTitles) {
    if (searchResults[i].show.premiered) title.append(` (${searchResults[i].show.premiered.slice(0, 4)})`)
    title.parentElement.id = i;
    title.parentElement.addEventListener('click', previewShow);
    i++;
}

let date = null;
function previewShow() {
    console.dir(this.id);
    showDimmer();
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', closeDimmer);
    const selected = searchResults[this.id];

    const showImg = document.querySelector('.show-preview-img');
    if (selected.show.image) showImg.src = selected.show.image.original;
    else showImg.src = "/imgs/no-img-portrait-text.png"

    const showTitle = document.querySelector('.show-preview-title');
    showTitle.innerText = selected.show.name;
    const showGenre = document.querySelector('.show-preview-genre');
    showGenre.innerText = selected.show.genres.join(', ');
    const showInfo = document.querySelector('.show-preview-info');
    showInfo.innerText = `Rating: ${selected.show.rating.average || '-'}/10, Language: ${selected.show.language}`;
    
    if (selected.show.premiered) {
        const dateArr = selected.show.premiered.split('-');
        date = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
        showInfo.append(`, Premiered: ${date}`);
    }
    
    const showDesc = document.querySelector('.show-preview-description');
    showDesc.innerHTML = selected.show.summary;
    const showRuntime = document.querySelector('.show-preview-runtime');
    showRuntime.innerText = `Average Runtime: ${selected.show.averageRuntime ? selected.show.averageRuntime + ' minutes' : 'Unknown'}, Status: ${selected.show.status}`;
    
    const oldListButton = document.querySelector('.list-button');
    listButton = oldListButton.cloneNode(true);
    listButton.addEventListener('click', async () => {
        addToList(this.id);
    });
    oldListButton.replaceWith(listButton);

}

async function addToList(id) {
    const showRating = document.querySelector('#rating').value;
    const actualShow = searchResults[id].show;
    const show = {
        _id: actualShow.id,
        name: actualShow.name,
        image: actualShow.image.medium,
        premiereDate: date,
        rating: showRating
    }

    await axios.post('/list', { show })
    .then(res => console.log(res))
    .catch(err => console.log(err));
    window.location.href = '/list'
}