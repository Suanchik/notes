import axios from "axios";

export class Question {
    static create(question) {
        return axios.post('https://podcast-app-b7cee-default-rtdb.firebaseio.com/questions.json', {body: question})
        .then(res => {
            question.id = res.data.name;
            addToLocalStorage(question);
            Question.renderList();
        })
    }
    static renderList() {
        const questions = getQuestionsFromLS();
         const html = questions.length ? 
         `<h1 class="headerList">Последние заметки из локального хранилища<hr></h1>${questions.map((el) => toCard(el)).join('')}` :
         `<div class="none">Вы пока ничего не спрашивали(локальное хранилище пустое)</div>`;

         const list = document.querySelector('.list');
         list.innerHTML = html;
    }

    static getQuestions(token) {

        if(!token) {
            return Promise.resolve('<p class="error">У вас нету токена</p>')
        }
        return axios.get(`https://podcast-app-b7cee-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
        .then(res => {
            if(res.data && res.data.error) {
                return `<p class="error">${res.data.error}</p>`
            }
            return res.data ? Object.keys(res.data).map(el => {
                return {
                    ...res.data[el],
                    id: el
                }
            }): []
        }
        )
    }
    static listToHtml(questions) {
        if(questions.length) {
            return `
            <ol>
            ${questions.map(el => {
                return `
                <li>${el.body.text}</li>
                `
            }).join('')}
            </ol>
            `
        } else {
            return `<p>заметок на локальном хранилище пока нет</p>`
        }
    }
};

function toCard(el) {
    return `
    <div class="question_story">
        <div class="text">${el.text}</div>
        <div class="data">${new Date(el.date).toLocaleDateString()}</div>
    </div>
    `
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLS();
    if(all.length == 6){all.pop()}
    all.unshift(question);
    localStorage.setItem('question', JSON.stringify(all))
}

function getQuestionsFromLS() {
    return JSON.parse(localStorage.getItem('question') || '[]');
}