import { Link } from "react-router-dom";
import React from "react";

export function Login() {
  return (
    <div>
      <p>You need to log in to access this page!</p>
      <div>
        <Link to={"/login/google"}>Log in Google</Link>
      </div>
      <div>
        <Link to={"/login/microsoft"}>Log in Microsoft</Link>
      </div>
    </div>
  );
}
