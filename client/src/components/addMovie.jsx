import { useEffect, useState } from "react";
import { fetchJSON } from "../hooks/global";

export function AddMovie() {
  const [title, setTitle] = useState("");

  async function handleNewMovie(event) {
    setTitle(event.target.title);

    console.log(title);
    await fetchJSON("/api/movies", {
      method: "POST",
      json: "TEST",
    });
  }

  return (
    <>
      <h2>Add Movie</h2>
      <form onSubmit={handleNewMovie}>
        <input title={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}
