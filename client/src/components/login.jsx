import { Link } from "react-router-dom";
import React from "react";

export function Login() {
  return (
    <div>
      <p>You need to log in to access this page!</p>
      <Link to={"/login"}>Log in</Link>
    </div>
  );
}
