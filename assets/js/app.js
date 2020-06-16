import React from 'react';
import ReactDOM from "react-dom";
/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)
import '../css/app.css';
import Navbar from './components/Navabar';
import HomePage from './pages/HomePage';
import { HashRouter, Switch, Route} from 'react-router-dom'
import CustomersPage from './pages/CustomersPage';
import InvoicesPage from './pages/InvoicesPage';

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

console.log('Hello Webpack test port ');

const App = () => {
    return <HashRouter>
    <Navbar/>

    <main className="container pt-5">
        <Switch>
            <Route path="/invoices" component={InvoicesPage} /> 
            <Route path="/customers" component={CustomersPage} />
            <Route path="/" component={HomePage} />
        </Switch>
    </main>

    </HashRouter>
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App />, rootElement);