import React, { useContext } from "react";
import { ProfileContext } from "../hooks/loginHook";
import { Link } from "react-router-dom";
import { Login } from "../components/login";

export function FrontPage({ reload }) {
  const { userinfo } = useContext(ProfileContext);

  async function handleLogout() {
    await fetch("/api/login", { method: "delete" });
    reload();
  }

  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <div>
            <Link to={"/profile"}>Profile for {userinfo.name}</Link>
          </div>
          <div>
            <Link to={"/movies"}>Movies</Link>
          </div>
        </div>
      )}
      {userinfo && (
        <div>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}
