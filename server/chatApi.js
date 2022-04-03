import { Router } from "express";

export function ChatApi(mongoDatabase) {
  const router = new Router();

  router.get("/", async (req, res) => {
    const chatlog = await mongoDatabase
      .collection("chatbase")
      .find()
      .sort({
        timestamp: 1,
      })
      .map(({ author, message, timestamp }) => ({
        author,
        message,
        timestamp,
      }))
      .limit(50)
      .toArray();

    console.log(chatlog);
    res.json(chatlog);
  });

  router.post("/", (req, res) => {
    const { author, message, timestamp } = req.body;
    console.log(req.body);

    mongoDatabase.collection("chatbase").insertOne({
      author,
      message,
      timestamp: parseInt(timestamp),
    });
    res.sendStatus(204);
  });

  return router;
}
