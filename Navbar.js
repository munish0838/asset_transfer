import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import Transfer from './Transfer';
import {Link} from "react-router-dom";

function Navbar  (){



        return (
        <div>
        <nav className = "navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-light"
                style = {
                    { backgroundColor: '#1c1e1f' } } >
                <a className = "navbar-brand" href = "/" >
                <img  onClick = { this.renderHome }
                style = {
                    { cursor: "pointer" } }
                    width = "60"
                    height = "50"
                    alt = "ETHEREUM EXCHANGE" />
                </a> 
                <h2 class = 'text-white text-center' align = 'center' > Asset Transfer </h2> 
                <div className = "collapse navbar-collapse" id = "navbarNavAltMarkup" >
                    <div className = "navbar-nav mr-auto" >
                        
                    {/* <button className = "btn btn-info btn-lg mx-3" onClick = {() => navigate('/Transfer') } > Transfer </button>  */}
                    {/* <button className = "btn btn-info btn-lg mx-3" onClick = { () => navigate('/Mint') } > Mint </button>  */}
                    {/* < button className = "btn btn-info btn-lg mx-3"  onClick = { this.renderReclaim } > Reclaim </button>  */}
                    </div> 
                </div> 
            </nav>
                        <ul>
                            <li><Link to = "/">Home</Link></li>
                            <li><Link to = "/Transfer">Transfer</Link></li>
                            <li><Link to = "/Mint">Mint</Link></li>
                        </ul>
        </div>
    );
} export default Navbar;