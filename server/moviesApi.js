import { Router } from "express";

export function MoviesApi(mongoDatabase) {
  const router = new Router();
  router.get("/", async (req, res) => {
    const movies = await mongoDatabase
      .collection("movies")
      .find({
        /*
        countries: {
          $in: ["Norway"],
        },
        year: {
          $gte: 2000,
        },
         */
      })
      .sort({
        metacritic: -1,
      })
      .map(({ title, year, plot, genre, poster, imdb, countries }) => ({
        title,
        year,
        plot,
        genre,
        poster,
        imdb,
        countries,
      }))
      .limit(50)
      .toArray();
    res.json(movies);
  });

  router.post("/", async (req, res) => {
    const { title } = req.body;
    await mongoDatabase.collection("movies").insertOne({
      title,
    });
    res.sendStatus(201);
  });

  router.get("/search/*", async (req, res) => {
    const title = req.query.title;

    const movies = await mongoDatabase
      .collection("movies")
      .find({
        title: new RegExp(title, "i"),
        /*
        countries: {
          $in: ["Norway"],
        },
        year: {
          $gte: 2000,
        },
         */
      })
      .sort({
        metacritic: -1,
      })
      .map(({ title, year, plot, genre, poster, imdb, countries }) => ({
        title,
        year,
        plot,
        genre,
        poster,
        imdb,
        countries,
      }))
      .limit(50)
      .toArray();
    if (!movies || movies.length === 0) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ movies });
  });

  return router;
}
