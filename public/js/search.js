const list = document.querySelector('.list');
const main = document.querySelector('main');
const newSearchResults = document.querySelector('.searchResults');
const searchTitle = document.querySelector('.title');
const emptyList = document.querySelector('.empty-list');
let searchResults = [];

runSearch(searchTerm);

async function runSearch(searchTerm) {
    newSearchResults.innerHTML = '';
    const config = { params: { q: searchTerm } };
    const res = await axios.get('https://api.tvmaze.com/search/shows', config);
    searchResults = res.data;
    if (searchResults.length === 0) {
        searchTitle.innerText = `Could not find results for '${searchTerm}'`;
        emptyList.classList.remove('hidden');
    } else {
        displayResults(res.data);
        searchTitle.innerText = `Showing results for '${searchTerm}'`;
        emptyList.classList.add('hidden');
    }
}

function displayResults(results) {
    let i = 0;
    for (data of results) {
        const newDiv = document.createElement('div');
        newDiv.classList.add('showResult');

        const newImg = document.createElement('img');
        if (data.show.image) newImg.src = data.show.image.medium;
        else newImg.src = "/imgs/no-img-portrait-text.png"
        newDiv.append(newImg);

        const newText = document.createElement('p');
        newText.append(data.show.name);
        if (data.show.premiered)
            newText.append(` (${data.show.premiered.slice(0, 4)})`)
        newDiv.append(newText);
        newDiv.id = i;

        newDiv.addEventListener('click', previewShow)

        newSearchResults.append(newDiv);
        i++;
    }
    main.append(newSearchResults);
}

function previewShow() {
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
        const date = `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
        showInfo.append(`, Premiered: ${date}`);
    }
    const showDesc = document.querySelector('.show-preview-description');
    showDesc.innerHTML = selected.show.summary;
    const showRuntime = document.querySelector('.show-preview-runtime');
    showRuntime.innerText = `Average Runtime: ${selected.show.averageRuntime ? selected.show.averageRuntime + ' minutes' : 'Unknown'}, Status: ${selected.show.status}`;
    
    const oldListButton = document.querySelector('.list-button');
    listButton = oldListButton.cloneNode(true);
    listButton.addEventListener('click', async () => {
        const showRating = document.querySelector('#rating').value;
        const actualShow = searchResults[this.id].show;
        const show = {
            _id: actualShow.id,
            name: actualShow.name,
            image: actualShow.image.medium,
            premiereDate: actualShow.premiered,
            rating: showRating
        }

        await axios.post('/list', { show })
        .then(res => console.log(res))
        .catch(err => console.log(err));
        window.location.href = '/list'
    });
    oldListButton.replaceWith(listButton);

}