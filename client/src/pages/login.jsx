import { Link } from "react-router-dom";
import React from "react";
import "./login.css";
export function Login() {
  return (
    <div>
      <h1>You need to log in to access this page!</h1>
      <div>
        <Link to={"/login/google"}>Log in Google</Link>
      </div>
      <div>
        <Link to={"/login/microsoft"}>Log in Microsoft</Link>
      </div>
    </div>
  );
}
