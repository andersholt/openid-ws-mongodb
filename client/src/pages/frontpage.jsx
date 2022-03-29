import React, { useContext } from "react";
import { ProfileContext } from "../hooks/login";
import { Link } from "react-router-dom";

export function FrontPage({ reload }) {
  const { userinfo } = useContext(ProfileContext);

  async function handleLogout() {
    await fetch("/api/login", { method: "delete" });
    reload();
  }

  return (
    <div>
      {!userinfo && (
        <div>
          <Link to={"/login"}>Log in</Link>
        </div>
      )}
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
