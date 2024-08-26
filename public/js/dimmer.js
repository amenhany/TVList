const dimmer = document.querySelector('.dimmer');

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    if (keyName === 'Escape') {
        closeDimmer();
    }
})

const closeDimmer = function () {
    dimmer.classList.add('hidden');
    document.body.classList.remove('stop-scroll');
}

const showDimmer = function () {
    dimmer.classList.remove('hidden');
    document.body.classList.add('stop-scroll');
}