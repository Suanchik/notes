
export const isvalid = (value) => {
    if(value.length >= 8) {
        return true
    }
};

export const createModal = (title, contetn) => {
    if(document.querySelector('.modalBlock')) {
        document.querySelector('.modalBlock').remove()
    }
    const modalBlock = document.createElement('div');
    modalBlock.classList.add('modalBlock');
    document.body.appendChild(modalBlock);

    const html = `
    <div class="modal">
        <h1>${title}</h1>
        <div>${contetn}</div>
    </div>
    <div class="iks">&times;</div>
    `;
    modalBlock.innerHTML = html
    document.querySelector('.iks')
    .addEventListener('click', close)
}

function close() {
    document.querySelector('.modalBlock').remove()
}

