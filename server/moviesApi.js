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

  router.post("/api/movies", (req, res) => {
    const { title } = req.body;
    console.log(req.body);
    console.log("Posting");
    mongoDatabase.collection("movies").insertOne({
      title,
    });
    res.sendStatus(204);
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
    if (!movies) {
      res.status(404).json({ errors });
      return;
    }
    res.json({ movies });
  });

  return router;
}
