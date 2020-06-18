import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import Axios from "axios";
import usersAPI from "../services/usersAPI";

const RegisterPage = ({history}) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // Gestion changement des données dans le form.
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    try {
       await usersAPI.register(user);
      history.replace('/login');
      setErrors({});
    } catch (error) {
        console.log(error.response);
        const { violations } = error.response.data;
        if (violations) {
          
          violations.forEach(violation => {
            apiErrors[violation.propertyPath] = violation.message
          });
          setErrors(apiErrors);
        }
      }
    };

  return (
    <>
      <h1>Inscription</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Harry"
          error={errors.firstName}
          value={user.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="Nom"
          placeholder="Potter"
          error={errors.lastName}
          value={user.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="Harry.potter@Hogward.uk"
          error={errors.email}
          value={user.email}
          onChange={handleChange}
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          error={errors.password}
          value={user.password}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            confirmation
          </button>
          <Link to="/login" className="btn btn-link">
            J'ai déjà un compte
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterPage;
