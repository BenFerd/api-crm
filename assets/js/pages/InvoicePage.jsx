import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom";
import customersAPI from "../services/customersAPI";
import axios from "axios";
import invoicesAPI from "../services/invoicesAPI";

const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;

  const [invoice, setInvoice] = useState({
    amout: "",
    customer: "",
    status: "SENT",
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);

  const [errors, setErrors] = useState({
    amout: "",
    customer: "",
    status: "",
  });
  // Récupération d'un client.
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) setInvoice({ ...invoice, customer: data[0].id });
    } catch (error) {
      history.replace("/invoices");
      console.log(error.response);
    }
  };
  // Récupération d'une facture.
  const fetchInvoice = async (id) => {
    try {
      const { amout, status, customer } = await invoicesAPI.find(id);
      setInvoice({ amout, status, customer: customer.id });
    } catch (error) {
      console.log(error.response);
      history.replace("/invoices");
    }
  };
  // Récupération de la liste des clients à chaque chargement.
  useEffect(() => {
    fetchCustomers();
  }, []);
  // Récupération de la facture en fvt de l'id dans l'url.
  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  // Gestion changement des données dans le form.
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };
  //Gestion soumission du form
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        await invoicesAPI.update(id, invoice);
      } else {
        await invoicesAPI.create(invoice);
        history.replace("/invoices");
      }
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
      {(editing && <h1>Modification de la facture</h1>) || (
        <h1>Création facture</h1>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="amout"
          type="number"
          placeholder="Montant"
          label="Montant"
          onChange={handleChange}
          value={invoice.amout}
          error={errors.amout}
        />
        <Select
          name="customer"
          label="Client"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))}
        </Select>
        <Select
          name="status"
          label="Statut"
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregister
          </button>
          <Link to="/invoices" className="btn btn-link">
            Retour aux factures
          </Link>
        </div>
      </form>
    </>
  );
};

export default InvoicePage;
