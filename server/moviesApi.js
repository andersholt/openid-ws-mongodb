import {Router} from "express";

const movies = [{title: "Movie1"}, {title: "Movie2"}, {title: "Movie3"},{title: "Movie4"}];


export function MoviesApi() {
    const router = new Router();
    router.get("/", (req, res) => {
        res.json(movies);
    });

    router.post("/new", (req, res) => {
        res.sendStatus(500)
    });
    return router
}