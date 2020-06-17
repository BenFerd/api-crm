import React, { useState, useContext } from 'react';
import authAPI from '../services/authAPI';
import AuthContext from '../context/AuthContext';

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
            <div className="form-group">
                <label htmlFor="username">Adresse email</label>
                <input 
                    onChange={handleChange}
                    value={credentials.username} 
                    type="email" 
                    placeholder="harry.potter@poudlard.uk" 
                    name="username" 
                    id="username" 
                    className={"form-control" + (error && " is-invalid")}/>
                    {error && <p className="invalid-feedback">{error}</p>}
            </div>
            <div className="form-group">
                <label htmlFor="password"></label>
                <input 
                    onChange={handleChange}
                    value={credentials.password} 
                    type="password" 
                    placeholder="Bière au beurre" 
                    name="password" 
                    id="password" 
                    className="form-control"/>
            </div>
            <div className="form-group"><button type="submit" className="btn btn-success">Connexion</button></div>
        </form>
    </>
     );
}
 
export default LoginPage;