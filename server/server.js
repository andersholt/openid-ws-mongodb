import express from "express";
import * as path from "path";
import bodyParser from "body-parser";
import loginApi from "./LoginApi.js"

const app = express();
app.use(bodyParser.urlencoded());
app.use("/api/login", loginApi)
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
