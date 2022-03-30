import React from "react";
import { fetchJSON, useLoader } from "../hooks/global";

export function ListMovies() {
  const { loading, data, error } = useLoader(async () => {
    return await fetchJSON("/api/movies");
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.toString()}</div>;
  }
  return (
    <div>
      {data.map((movie, index) => (
        <div key={index}>
          <h4>{movie.title}</h4>
          <p>Rating: {movie.imdb.rating}</p>
          {movie.poster && (
            <img src={movie.poster} style={{ width: "200px" }} />
          )}
          <p>{movie.plot}</p>
        </div>
      ))}
    </div>
  );
}
