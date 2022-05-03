import {Link} from "react-router-dom";
import React from "react";
import "./loginPage.css"

export function LoginPage() {
    return (
        <div className={"login"}>
            <h1>You need to log in to access this page!</h1>
            <div>
                <Link to={"/login/google"}>Google login</Link>
            </div>
            <div>
                <Link to={"/login/microsoft"}>Kristiania login</Link>
            </div>
        </div>
    );
}
