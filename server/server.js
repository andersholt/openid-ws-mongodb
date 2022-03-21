import express from "express";
import * as path from "path";

const app = express();

app.use(express.static("../client/dist"));

//Middleware som sørger for at vi sender filer, med mindre vi skal ha tak i data fra api
app.use((req, res, next) => {
  if (req.method == "GET" && !req.path.startsWith("/api")) {
    res.sendfile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});

const server = app.listen(process.env.PORT || 3000, () =>
  console.log(server.address().port)
);
