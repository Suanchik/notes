import axios from "axios"

export function getAuthForm() {
    return `
    <form class="auth_form">
        <div>
            <input placeholder="email" id="email" type="text">
        </div>
        <div>
            <input placeholder="password" type="text" id="password">
        </div>
        <button class="logIn">
            Войти
        </button>
    </form>
    `
};

export function authWithEmailAndPassword(email, password) {
    const login = document.querySelector('.logIn');
    const apikey = 'AIzaSyAeZn6iaK1Cqt3imSfKao2ippRrIyJjMJ8';
    if(login){
        login.classList.add('opasiti');
        login.disabled = true;
    }
    return axios
    .post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apikey}`, {
        email, 
        password,
        returnSecureToken: true
    })
    .then(res => {
        if(login){
            login.classList.remove('opasiti');
    }
        return res.data.idToken
    }).catch(err => console.log(err))
}