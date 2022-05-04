import express from "express";
import * as path from "path";
import bodyParser from "body-parser";
import loginApi from "./loginApi.js"
import {MongoClient} from "mongodb";
import {articlesApi} from "./articlesApi.js";

const app = express();

app.use(bodyParser.urlencoded());
app.use("/api/login", loginApi)

const mongoClient = new MongoClient(process.env.MONGODB_URL);
mongoClient.connect().then(async () => {
    console.log("Connected to MongoDB");
    const databases = await mongoClient.db().admin().listDatabases();
    app.use(
        "/api/articles",
        articlesApi(mongoClient.db(process.env.MONGO_ARTICLEDB || "articles_app"))
    );
});


app.use(express.static("../client/dist"));
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        res.sendfile(path.resolve("../client/dist/index.html"));
    } else {
        next();
    }
});

const server = app.listen(process.env.PORT || 3000, () => {
    console.log("http://localhost:" + server.address().port);

    server.on("upgrade", (req, socket, head) => {
        wsServer.handleUpgrade(req, socket, head, (socket) => {
            wsServer.emit("connect", socket, req);
        });
    });
});
