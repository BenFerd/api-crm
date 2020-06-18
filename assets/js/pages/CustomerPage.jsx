import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Field from "../components/forms/Field";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });
  // Gestion changement des données dans le form.
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  const [editing, setEditing] = useState(false);
  // Recupère le client en fct de l'id.
  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } = await customersAPI.find(
        id
      );

      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.log(error.response);
    }
  };
  // Chargement du client en fonction de l'id de l'url.
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion soumission form.
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await customersAPI.update(id, customer);
      } else {
        await customersAPI.create(customer);
        history.replace("/customers");
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;
      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };
  return (
    <>
      {(!editing && <h1>Ajout d'un client</h1>) || (
        <h1>Modification du client</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom"
          placeholder="Nom"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Prénom"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email"
          placeholder="email"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          placeholder="Entreprise du client"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />

        <div className="form-group">
          <button type="submit" className="btn-btn-success">
            Enregistrer
          </button>
          <Link to="/customers">Retour à la liste</Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
