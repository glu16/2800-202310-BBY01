require("./utils.js");

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const saltRounds = 12;

const port = process.env.PORT || 3000;

const app = express();

const Joi = require("joi");

const expireTime = 60 * 60 * 1000; // Expires after 1 hour (minutes * seconds * millis)

/* secret information section */
const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;
const mongodb_session_secret = process.env.MONGODB_SESSION_SECRET;

const node_session_secret = process.env.NODE_SESSION_SECRET;
/* END secret section */

var { database } = include("databaseConnection");

const userCollection = database.db(mongodb_database).collection("users");

app.use(express.urlencoded({ extended: false }));

var mongoStore = MongoStore.create({
  mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/sessions`,
  crypto: {
    secret: mongodb_session_secret,
  },
});

app.use(
  session({
    secret: node_session_secret,
    store: mongoStore,
    saveUninitialized: false,
    resave: true,
  })
);

app.get("/", (req, res) => {
  // if (!req.session.authenticated) {
    res.sendFile(__dirname + '/app/html/index.html');
  // } else {
  //   const buttons = `
  //     <button onclick="window.location.href='/members'">Go to Members Area</button>
  //     <button onclick="window.location.href='/logout'">Log out</button>
  //   `;
  //   res.send(`<h1>Hello, ${req.session.username}!</h1>${buttons}`);
  // }
});

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/app/html/index.html');
});


app.get("/signup.html", (req, res) => {
  res.sendFile(__dirname + '/app/html/signup.html');
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + '/app/html/login.html');
});

app.post("/submitUser", async (req, res) => {
  var userFirstName = req.body.firstName;
  var userLastName = req.body.lastName;
  var password = req.body.password;
  var email = req.body.email;

  const schema = Joi.object({
    userFirstName: Joi.string().alphanum().max(20).required(),
    userLastName: Joi.string().alphanum().max(20).required(),
    password: Joi.string().max(20).required(),
    email: Joi.string().email().required(),
  });

  const validationResult = schema.validate({ userFirstName, userLastName, password, email });
  if (validationResult.error != null) {
    console.log(validationResult.error);
    var errorMessage = validationResult.error.details[0].message;
    res.send(`Error: ${errorMessage}. Please <a href="/signup">try again</a>.`);
    return;
  }

  var hashedPassword = await bcrypt.hash(password, saltRounds);

  await userCollection.insertOne({
    firstName: userFirstName,
    lastName: userLastName,
    password: hashedPassword,
    email: email,
  });
  console.log("Inserted user");

  req.session.authenticated = true;
  req.session.firstName = userFirstName;

  res.redirect("/");
});


app.post("/loggingin", async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  const schema = Joi.string().max(20).required();
  const validationResult = schema.validate(email);
  if (validationResult.error != null) {
    console.log(validationResult.error);
    res.redirect("/login");
    return;
  }

  const result = await userCollection
    .find({ email: email })
    .project({ firstName: 1, email: 1, password: 1, _id: 1 })
    .toArray();

  console.log(result);
  if (result.length != 1) {
    console.log("User not found");
    res.redirect("/login");
    return;
  }
  if (await bcrypt.compare(password, result[0].password)) {
    console.log("Correct password");
    req.session.authenticated = true;
    req.session.email = email;
    req.session.firstName = result[0].firstName;
    req.session.cookie.maxAge = expireTime;

    res.redirect("/loggedin");
    return;
  } else {
    console.log("Incorrect password");
    res.send(`Incorrect password. Please <a href="/login">try again</a>.`);
    return;
  }
});

app.get("/loggedin", (req, res) => {
  if (!req.session.authenticated) {
    res.redirect("/login");
  } else {
    res.redirect("/");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

const images = [
  "nature-walk.jpeg",
  "winter-landscape.jpeg",
  "autumn-walk.jpeg",
];

app.get("/nature/:id", (req, res) => {
  var beach = req.params.id;

  if (beach == 1) {
    res.send(`<img src='/${images[0]}' style='width:250px;'>`);
  } else if (beach == 2) {
    res.send(`<img src='/${images[1]}' style='width:250px;'>`);
  } else if (beach == 3) {
    res.send(`<img src='/${images[2]}' style='width:250px;'>`);
  } else {
    res.send("Invalid nature id: " + nature);
  }
});

app.get("/members", (req, res) => {
  if (!req.session.username) {
    res.redirect("/");
    return;
  }

  const username = req.session.username;
  const image = images[Math.floor(Math.random() * images.length)];

  const html = `
    <h1>Hello, ${username}!</h1>
    <img src="/${image}" alt="Random image">
    <br><br>
    <button onclick="window.location.href='/logout'">Log out</button>
  `;

  res.send(html);
});

app.use(express.static(__dirname + "/public"));

app.get("*", (req, res) => {
  res.status(404);
  res.send("Page not found - 404");
});

app.listen(port, () => {
  console.log("COMP 2800 is listening on Port " + port + "!");
});
