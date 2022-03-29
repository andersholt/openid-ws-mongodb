import { ListMovies } from "../components/moviesList";
import { Login } from "../components/login";
import React, { useContext } from "react";
import { ProfileContext } from "../hooks/loginHook";

export function Movies() {
  const { userinfo } = useContext(ProfileContext);

  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <h1>Movie Database:</h1>
          <ListMovies />
        </div>
      )}
    </div>
  );
}
