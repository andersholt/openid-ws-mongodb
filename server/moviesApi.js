import { Router } from "express";

export function MoviesApi(mongoDatabase) {
  const router = new Router();
  router.get("/", async (req, res) => {
    const movies = await mongoDatabase
      .collection("movies")
      .find()
      .map(({ title, year, plot, genre, poster }) => ({
        title,
        year,
        plot,
        genre,
        poster,
      }))
      .limit(50)
      .toArray();
    res.json(movies);
  });

  router.post("/new", (req, res) => {
    res.sendStatus(500);
  });
  return router;
}
