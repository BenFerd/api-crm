import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import CustomersAPI from '../services/customersAPI';
import { Link } from 'react-router-dom';


const CustomersPage = (props) => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState ("");

    // Fct qui va récupérer les clients.
    const fetchCustomers = async () => {
        try {
            const data = await CustomersAPI.findAll()
            setCustomers(data);
        } catch(error) {
            console.log(error.response);
        }
    };

    // Au chargement du component, va chercher les clients.
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Gestion de la suppression d'un client.
    const handleDelete = async id => {
        const originalCustomers = [...customers];

        setCustomers(customers.filter(customer => customer.id !== id));

        try{
            await CustomersAPI.delete(id)
        } catch(error) {
            setCustomers(originalCustomers);
        }
    };

    // Gestion du changement de page.
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Gestion de la recherche.
    const handleSearch = ({currentTarget}) => {
        setSearch(currentTarget.value);
        setCurrentPage(1);
    };

    // Filtrage des clients pour la barre de recherche.
    const filtredCustomers = customers.filter(c => 
        c.firstName.toLowerCase().includes(search.toLowerCase()) || 
        c.lastName.toLowerCase().includes(search.toLowerCase()) || 
        c.email.toLowerCase().includes(search.toLowerCase()) || 
        (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
    );

    const itemsPerPage = 10;

    // Pagination.
    const paginatedCustomers = Pagination.getData(
        filtredCustomers, 
        currentPage, 
        itemsPerPage
        );


    return ( 
    <>
        <div className="mb-3 d-flex justify-content-between align-items-center">
        <h1>Liste des Clients</h1>
        <Link to="/customer/new" className="btn btn-primary">Créer un client</Link>
        </div>

        <div className="form-group">
            <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
        </div>

        <table className="table table-hover">
            <thead>
                <tr>
                    <th>Id.</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprises</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
            </thead>

            <tbody>
                {paginatedCustomers.map(customer => (                // map l'array des customers paginé (*ngFor="let customer of customers")
                <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>
                    <a href="#">{customer.firstName} {customer.lastName}</a>
                    </td>
                    <td>{customer.email}</td>
                    <td>{customer.company}
                    </td>
                    <td className="text-center">{customer.invoices.length}</td>
                    <td className="text-center">{customer.totalAmount.toLocaleString()}€</td>
                    <td>
                        <button 
                            disabled={customer.invoices.length > 0} 
                            onClick={() => handleDelete(customer.id)}
                            className="btn btn-sm btn-danger">Supprimer
                        </button>
                    </td>
                </tr>
                    ))}
                
                    
            </tbody>
        </table>

        
        {itemsPerPage < filtredCustomers.length && 
        <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage}
         length={filtredCustomers.length} onPageChanged={handlePageChange}/>}
    </>
        );
}
 
export default CustomersPage;