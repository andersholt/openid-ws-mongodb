import express from "express";
import * as path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import { MoviesApi } from "./moviesApi.js";
import { MongoClient } from "mongodb";
import { WebSocketServer } from "ws";
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded());
app.use(cookieParser(process.env.COOKIE_SECRET));

const oauth_config = {
  discovery_url: "https://accounts.google.com/.well-known/openid-configuration",
  client_id: process.env.CLIENT_ID,
  scope: "openid email profile",
};

const mongoClient = new MongoClient(process.env.MONGODB_URL);
mongoClient.connect().then(async () => {
  console.log("Connected to MongoDB");
  const databases = await mongoClient.db().admin().listDatabases();
  app.use(
    "/api/movies",
    MoviesApi(mongoClient.db(process.env.MONGO_MOVIEDATABASE || "sample_mflix"))
  );
  app.use(
    "/api/chat",
    MoviesApi(mongoClient.db(process.env.MONGO_CHATDATABASE || "chat_app"))
  );
});

async function fetchJSON(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`Error fetching ${url}: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

app.delete("/api/login", (req, res) => {
  res.clearCookie("access_token");
  res.sendStatus(200);
});

app.get("/api/login", async (req, res) => {
  const { access_token } = req.signedCookies;
  const discoveryDocument = await fetchJSON(oauth_config.discovery_url);
  const { userinfo_endpoint } = discoveryDocument;
  let userinfo = undefined;
  try {
    userinfo = await fetchJSON(userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  } catch (error) {
    console.error({ error });
  }
  res.json({ userinfo, oauth_config }).status(200);
});

app.post("/api/login", (req, res) => {
  const { access_token } = req.body;
  res.cookie("access_token", access_token, { signed: true });
  res.sendStatus(200);
});

app.use(express.static("../client/dist"));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendfile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const sockets = [];

const wsServer = new WebSocketServer({ noServer: true });
wsServer.on("connect", (socket) => {
  sockets.push(socket);
  socket.send(JSON.stringify({ author: "Server", message: "Hello there" }));
  socket.on("message", (data) => {
    const { author, message } = JSON.parse(data);
    for (const recipient of sockets) {
      recipient.send(JSON.stringify({ author, message }));
    }
  });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log("http://localhost:" + server.address().port);

  server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (socket) => {
      wsServer.emit("connect", socket, req);
    });
  });
});
