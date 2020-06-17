import axios from 'axios';
import JwtDecode from 'jwt-decode';

/**
 * Requête HTTP de login et stockage token dans le localstorage et axios.
 * @param {object} credentials 
 */
function authenticate(credentials) {
    return axios
           .post("http://localhost:8000/api/login_check", credentials)
           .then(response => response.data.token)
           .then(token => {
            // Stockage du token dans le local storage.
           window.localStorage.setItem("authToken", token);
           // On dit a axios qu'on a un header par défault dans nos futurs requêtes HTTP.
           setAxiosToken(token);

          return true;
           })
}
/**
 * Déconnexion de l'utilisateur, via la suppression du token du localstorage et axios.
 */
function logout() {
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
}
/**
 * Met le token sur axios.
 * @param {string} token 
 */
function setAxiosToken(token) {
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}
/**
 * Mise en place lors du chargement de l'app.
 */
function setup() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = JwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
        } 
    }

}
/**
 * Permet de savoir si on est auth.
 * @returns boolean
 */
function isAuthenticated() {
    const token = window.localStorage.getItem("authToken");

    if (token) {
        const jwtData = JwtDecode(token);
        if(jwtData.exp * 1000 > new Date().getTime()) {
            setAxiosToken(token);
            return true;
        } 
        return false;
    }
    return false;
}

export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};
