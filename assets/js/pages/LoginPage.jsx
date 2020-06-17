import React, { useState, useContext } from 'react';
import authAPI from '../services/authAPI';
import AuthContext from '../context/AuthContext';
import Field from '../components/forms/Field';

const LoginPage = ({ history }) => {

    const {setIsAuthenticated} = useContext(AuthContext);

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("");

    // Gestion des champs.
    const handleChange = ({currentTarget}) => {
        const { value, name} = currentTarget;

        setCredentials({...credentials, [name]: value});
    };
    // Gestion du submit.
    const handleSubmit = async event => {
        event.preventDefault(); 
        try {
         await authAPI.authenticate(credentials);
         setError("");
         setIsAuthenticated(true);
         history.replace("/");
        } catch (error){
            setError("Le compte d'utilisateur n'existe pas!");
        }
        
    }

    return ( 
    <>
        <h1>Connexion</h1>

        <form onSubmit={handleSubmit}>
            <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange}
                placeholder="harry.potter@Hogward.uk" error={error}/>
            <Field label="password" name="password" value={credentials.password} type="password" placeholder="Bière au beurre"
                onChange={handleChange}/>

            <div className="form-group"><button type="submit" className="btn btn-success">Connexion</button></div>
        </form>
    </>
     );
}
 
export default LoginPage;