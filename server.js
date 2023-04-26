// REQUIRES
import express from 'express';
import fs from 'fs';
import open from 'open';
const app = express();

app.use(express.json());

// mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/font", express.static("./public/font"));
app.use("/html", express.static("./app/html"))

// Pages
const routePath = "./app/html";

app.get("/:id", function (req, res) {
  let doc = fs.readFileSync(`${routePath}/${req.params.id}.html`, "utf8");
  res.send(doc);
});

app.get("/", function (req, res) {

  let doc = fs.readFileSync(routePath + "/index.html", "utf8");
  res.send(doc);
});

// for page not found
app.use(function (req, res, next) {
  res
    .status(404)
    .send(
      "<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>"
    );
});

// RUN SERVER
let port = 3000;
app.listen(port, function (err) {
  if (err) console.log(err);
  else open(`http://localhost:${port}`, { app: "google chrome" });
});
