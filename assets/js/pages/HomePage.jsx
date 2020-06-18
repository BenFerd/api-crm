import React from "react";

const HomePage = (props) => {
  return (
    <div className="jumbotron">
      <h1 className="display-3">Bienvenue</h1>
      <p className="lead">
        Pour débuter, créez vous un compte sur l'onglet inscription en haut à droite.
      </p>
      <hr className="my-4" />
      <p>
        FreeCRM vous permet de gérer vos clients et les factures qui leurs sont liés.
      </p>
      <p className="lead">
        <a className="btn btn-primary btn-lg" href="#" role="button">
          Learn more
        </a>
      </p>
    </div>
  );
};

export default HomePage;
