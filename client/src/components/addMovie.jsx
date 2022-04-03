import { useEffect, useState } from "react";
import { fetchJSON } from "../hooks/global";

export function AddMovie() {
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [countries, setCountries] = useState([]);
  const [rating, setRating] = useState({});

  async function handleNewMovie(event) {
    event.preventDefault();

    await fetch("/api/movies/add", {
      method: "post",
      body: new URLSearchParams({
        title,
        plot,
        countries,
        rating,
      }),
    });
    setTitle("");
  }

  return (
    <>
      <h2>Add Movie</h2>
      <form onSubmit={handleNewMovie}>
        <input title={title} onChange={(e) => setTitle(e.target.value)} />
        <input plot={plot} onChange={(e) => setPlot(e.target.value)} />
        <input
          countries={countries}
          onChange={(e) => setCountries([e.target.value])}
        />
        <input
          rating={rating}
          type={"number"}
          onChange={(e) => setRating({ imdb: { rating: e.target.value } })}
        />

        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
