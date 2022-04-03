import { ListMovies } from "../components/moviesList";
import { Login } from "./login";
import React, { useContext } from "react";
import { ProfileContext } from "../components/loginProvider";
import { AddMovie } from "../components/addMovie";

export function Movies() {
  const { userinfo } = useContext(ProfileContext);

  return (
    <div>
      {!userinfo && <Login />}
      {userinfo && (
        <div>
          <h1>Movie Database:</h1>
          <AddMovie />
          <ListMovies />
        </div>
      )}
    </div>
  );
}
