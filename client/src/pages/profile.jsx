import React, { useContext } from "react";
import { ProfileContext } from "../components/loginProvider";
import { Link } from "react-router-dom";
import { Login } from "../components/login";

export function Profile() {
  const { userinfo } = useContext(ProfileContext);

  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <h1>
            Profile for {userinfo.name} ({userinfo.email})
          </h1>
          <div>
            <img src={userinfo.picture} alt="Profile picture" />
          </div>
        </div>
      )}
    </div>
  );
}
