import { useState } from "react";
import { fetchJSON } from "../hooks/global";

export function AddMovie() {
  const [title, setTitle] = useState("");

  async function handleNewMovie(event) {
    event.preventDefault();
    console.log(title);
    await fetchJSON("/api/movies", {
      method: "post",
      json: { title },
    });
    setTitle("");
  }

  return (
    <>
      <h2>Add Movie</h2>
      <form onSubmit={handleNewMovie}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
        <button>Submit</button>
      </form>
    </>
  );
}
