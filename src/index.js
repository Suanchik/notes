import { authWithEmailAndPassword, getAuthForm } from './auth';
import { Question } from './question';
import './styles.scss'
import { isvalid, createModal } from './utils';

const form = document.querySelector('#form');
const input = form.querySelector('#question');
const submitBtn = form.querySelector('.submit');
const plus = document.querySelector('.plus');
const leftBlock = document.querySelector('.left_block');



function addButton() {
        if (JSON.parse(localStorage.getItem('isAuth'))) {
        if(!document.querySelector('.logout')){
            const button = document.createElement('button');
            button.classList.add('logout');
            button.innerHTML = 'Выйти';
            leftBlock.appendChild(button);
        }
    } else {
        if(document.querySelector('.logout')){
            document.querySelector('.logout').remove()
        }
    }
};

addButton();

let btn = document.querySelector('.logout');

const logOut = () => {
    localStorage.removeItem('authemailpassword');
    localStorage.removeItem('isAuth');
    addButton();
}

btn?.addEventListener('click', logOut);


plus.addEventListener('click', showModal)

input.addEventListener('input', () => {
    if(!isvalid(input.value)) {
        submitBtn.classList.add('opasiti');
    } else {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opasiti');
    }
})
window.addEventListener('load', Question.renderList())
form.addEventListener('submit', submitFormHandler);

function submitFormHandler(event) {
    event.preventDefault();
    if(isvalid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled = true;
        Question.create(question).then(() => {
            input.value = ''
            submitBtn.classList.add('opasiti');
            submitBtn.disabled = false;
        })
    }
};

function showModal() {
    if (!JSON.parse(localStorage.getItem('isAuth'))) {
        createModal('Авторизация', getAuthForm());
        document.querySelector('.auth_form')
        .addEventListener('submit', authFormHandler);
    } else {
        const authemail = JSON.parse(localStorage.getItem('authemailpassword')).email;
        const authpassword = JSON.parse(localStorage.getItem('authemailpassword')).password;
        authWithEmailAndPassword(authemail, authpassword)
        .then(token => Question.getQuestions(token))
        .then(renderModalAfterAuth);
    }
}

let email = ''
let password = ''

function authFormHandler(event) {
    event.preventDefault();

    email = event.target.querySelector('#email').value;
    password = event.target.querySelector('#password').value;

    authWithEmailAndPassword(email, password)
    .then(token => Question.getQuestions(token))
    .then(renderModalAfterAuth);
};



function renderModalAfterAuth(content) {
    console.log(content)
    if(typeof content === 'string') {
        createModal('Ошибка', content);
        localStorage.setItem('isAuth', 'false');
    } else {
        createModal('ваши заметки', Question.listToHtml(content));
        if(!!email && password){
            const authemailpassword = {email, password};
            localStorage.setItem('authemailpassword', JSON.stringify(authemailpassword))
        }
        localStorage.setItem('isAuth', 'true');
        addButton();
    }
}
