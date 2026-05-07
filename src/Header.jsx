// This component will hold the links and title for our quiz and navigation links

import React from "react";
import { Link } from "react-router-dom"; 

function Header(){
    return(
    <header>
        <h1>Which Element are You?</h1>
        <p>(based on completely random things)</p>
        <nav>
            <Link to = "/">Home</Link>
            <Link to = "/quiz">Quiz</Link>
        </nav>
    </header>);
}

export default Header