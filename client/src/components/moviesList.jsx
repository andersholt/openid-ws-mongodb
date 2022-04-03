import React, { useEffect, useRef, useState } from "react";
import { fetchJSON, useLoader } from "../hooks/global";

export function ListMovies() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (search === "") {
      fetchJSON("/api/movies").then((jsonData) => {
        setData(jsonData);
      });
    } else {
      fetchJSON(`/api/movies/search/?title=${search}`).then((jsonData) => {
        setData(jsonData.movies);
      });
    }
  }, [search]);

  const { error, loading } = useLoader(async () => {
    return await fetchJSON("/api/movies").then((jsonData) => {
      setData(jsonData);
    });
  });

  async function handleSearch(event) {
    await setSearch(event);
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.toString()}</div>;
  }

  return (
    <div id="movie-cards">
      <h2>Search Movies:</h2>

      <input value={search} onChange={(e) => handleSearch(e.target.value)} />
      {search && <div>Results for {search}</div>}

      {data && (
        <div>
          {data.map((movie, index) => (
            <div key={index} id="movie-card">
              <h2>{movie.title}</h2>
              {movie.imdb && <p>Rating: {movie.imdb.rating}</p>}
              {movie.poster && (
                <img src={movie.poster} style={{ width: "200px" }} />
              )}
              <h4>Plot:</h4>
              {movie.plot}
              <p>{movie.plot}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
