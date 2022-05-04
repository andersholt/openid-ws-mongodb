import {Router} from "express";

export function articlesApi(mongoDatabase) {
    const router = new Router();
    router.get("/all", async (req, res) => {
        const articles = await mongoDatabase
            .collection("articles")
            .find()
            .sort({
                date: -1,
            })
            .map(({title, date, author, topic, updated}) => ({
                title,
                date,
                author,
                topic,
                updated
            }))
            .toArray();
        res.json(articles);
    });

    router.post("/publish", (req, res) => {
        const {title, date, author, topic, articleText} = req.body;
        mongoDatabase.collection("articles").insertOne({
            title,
            date,
            author,
            topic,
            articleText
        });
        res.sendStatus(204);
    });


    router.get("/search/*", async (req, res) => {
        const title = req.query.title;

        const articles = await mongoDatabase
            .collection("articles")
            .find({
                title: new RegExp(title, "i"),
            })
            .sort({
                date: -1,
            })
            .map(({title, date, author, topic, updated}) => ({
                title,
                date,
                author,
                topic,
                updated
            }))
            //.limit(50)
            .toArray();
        if (!articles) {
            res.status(404).json({errors});
            return;
        }
        res.json({articles});
    });

    router.get("/select/*", async (req, res) => {
        const title = req.query.title;
        console.log(title)

        const article = await mongoDatabase
            .collection("articles")
            .find({
                title,
            })
            .map(({title, date, author, topic, articleText, updated}) => ({
                title,
                date,
                author,
                topic,
                articleText,
                updated
            }))
            .toArray()
        if (!article) {
            res.status(404).json({errors});
            return;
        }
        res.json({article});
    });

    router.put("/select/*", async (req, res) => {
        const originalTitle = req.query.originalTitle;

        console.log(originalTitle)

        const {title, updated, author, topic, articleText} = req.body
        mongoDatabase.collection("articles").updateOne({title: originalTitle}, {
            $set: {
                title,
                updated,
                author,
                topic,
                articleText
            }
        })
        res.json({"message": "done"}).status(204)
    });


    router.delete("/select/*", async (req, res) => {
        const title = req.query.title;
        mongoDatabase.collection("articles").deleteOne({title: title})
        res.json({"message": "done"})
    });


    return router;
}