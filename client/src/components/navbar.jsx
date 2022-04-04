import { Link } from "react-router-dom";
import React, { useContext } from "react";
import { ProfileContext } from "./loginProvider";
import { handleLogout } from "../pages/frontpage";

export function Navbar() {
  const { userinfo } = useContext(ProfileContext);
  return (
    <div>
      {userinfo && (
        <div>
          <Link to={"/profile"}>Profile</Link>
          <button onClick={handleLogout}>Log out</button>
        </div>
      )}
    </div>
  );
}
