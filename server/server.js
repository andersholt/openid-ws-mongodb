import express from "express";
import * as path from "path";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fetch from "node-fetch"
import {MoviesApi} from "./moviesApi.js";
import {MongoClient} from "mongodb";
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGODB_URL)
mongoClient.connect()

const app = express();


app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

async function fetchJSON(url, options){
  const res = await fetch(url, options)
  if(!res.ok){
    throw new Error(`Failed ${res.status}`);
  }
  return await res.json();
}

app.get("/api/logout", (req,res) => {
  res.cookie("access_token", "", {expires: new Date(Date.now())});
  res.sendStatus(200)

})

app.get("/api/login", async (req, res) => {
  const {access_token} = req.signedCookies;
  console.log(access_token)

  if(typeof access_token === 'undefined'){
    res.send(401)
  } else {
    const {userinfo_endpoint} = await fetchJSON(
        "https://accounts.google.com/.well-known/openid-configuration"
    )

    const userinfo = await fetchJSON(userinfo_endpoint, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    res.json(userinfo)
  }
})

app.post("/api/login", (req, res) =>{
  const {access_token} = req.body;
  res.cookie("access_token", access_token, {signed: true});
  res.sendStatus(200)
});

app.use(express.static("../client/dist"));
//Middleware som sørger for at vi sender filer, med mindre vi skal ha tak i data fra api
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendfile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});


app.use("/api/movies", MoviesApi());


const server = app.listen(process.env.PORT || 3000, () =>
  console.log("http://localhost:" + server.address().port)
);