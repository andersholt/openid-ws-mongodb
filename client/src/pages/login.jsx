import { Link } from "react-router-dom";
import React from "react";
export function Login() {
  return (
    <div>
      <div>
        <h1>You need to log in to access this page!</h1>
        <div>
          <Link to={"/login/google"}>Log in with Google user</Link>
        </div>
        <div>
          <Link to={"/login/microsoft"}>Log in with your Kristiania user</Link>
        </div>
      </div>
    </div>
  );
}
