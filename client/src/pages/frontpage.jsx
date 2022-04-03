import React, { useContext } from "react";
import { ProfileContext } from "../components/loginProvider";
import { Link } from "react-router-dom";
import { Login } from "../pages/login";

export function FrontPage({ reload }) {
  const { userinfo } = useContext(ProfileContext);

  console.log(useContext(ProfileContext));
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

          <div>
            <Link to={"/chat"}>Chatapp</Link>
          </div>
          <div>
            <button onClick={handleLogout}>Log out</button>
          </div>
        </div>
      )}
    </div>
  );
}
