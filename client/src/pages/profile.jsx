import React, { useContext } from "react";
import { ProfileContext } from "../components/loginProvider";
import { Link } from "react-router-dom";
import { Login } from "./login";

export function Profile() {
  const { userinfo } = useContext(ProfileContext);
  console.log(userinfo);
  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <h1>
            Profile for {userinfo.name} ({userinfo.email})
          </h1>
          {userinfo.picture && (
            <img src={userinfo.picture} alt="Profile picture" />
          )}
          {userinfo.usertype === "kristiania" && (
            <p>This user is certified by Kristiania University College</p>
          )}
        </div>
      )}
    </div>
  );
}
