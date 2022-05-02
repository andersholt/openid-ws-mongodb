import React, { useContext } from "react";
import { ProfileContext } from "../components/loginProvider";
import { Link } from "react-router-dom";
import { Login } from "./login";

export async function handleLogout() {
  await fetch("/api/login", { method: "delete" });
  window.location.reload(false);
}
export function FrontPage() {
  const { userinfo } = useContext(ProfileContext);

  console.log(useContext(ProfileContext));

  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <div>
            <Link to={"/movies"}>Movies</Link>
          </div>
          <div>
            <Link to={"/chat"}>Chatapp</Link>
          </div>
        </div>
      )}
    </div>
  );
}
