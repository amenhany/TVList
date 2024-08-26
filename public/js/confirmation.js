const popupButtons = document.querySelectorAll('.popup-button');
const cancelButton = document.querySelector('.cancel-button');
const popupSpan = document.querySelector('#popup-name')

cancelButton.addEventListener('click', closeDimmer);

for (popupButton of popupButtons) {
    popupButton.addEventListener('click', function () {
        showDimmer();
        const row = this.closest('tr')
        popupSpan.innerText = row.children[1].innerText;

        const deleteButton = document.querySelector('.delete-button');
        deleteButton.addEventListener('click', async () => {
            await axios.delete('/list', {
                data: { _id: parseInt(this.id) }
            })
            .then(res => console.log(res))
            .catch(err => console.log(err));

            location.reload();
        })
    });
}