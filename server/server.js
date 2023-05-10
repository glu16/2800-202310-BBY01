/*
A LARGE MARJORITY OF THIS CODE THAT HOOKS UP THE 
SIGNIN/LOGIN WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
https://www.youtube.com/watch?v=HGgyd1bYWsE 
*/

const {Configuration, OpenAIApi} = require("openai");
const express = require("express");
const app = express();
const db = require("./database.js");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const passChangeRouter = require("./routes/passChange");

// THE MODELS
const {User} = require("./models/users");
const Tips = require("./models/tips");

const cors = require("cors");
require("dotenv").config();

//OPENAI CONFIGURATION
const configuration = new Configuration({
  organization: process.env.ORG,
  apiKey: process.env.AI,
});
const openai = new OpenAIApi(configuration);

// THE CONNECTION TO DATABASE
db();

// MIDDELWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/passChange", passChangeRouter);

/*  
GENERIC TEMPLATE FOR GETTING DATA FROM USER
COPY THIS CODE DON'T OVERWRITE IT
CHANGE URL TO SOMETHING ELSE
*/
app.get("/getFromUser/:email", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.email;

  try {
    // FINDS THE USER BY EMAIL
    const user = await User.findOne({email: userID});
    if (!user) {
      return res.status(400).send("Email not registered" + userID);
    }
    //REPLACE 'REPLACE_ME' WITH KEY OF DATA YOU WANT TO GET
    const item = user.REPLACE_ME;
    res.json(item);
  } catch (e) {
    console.log(e);
  }
});

// GETS THE USER'S DATA FROM THE DATABASE
app.get("/users/:username", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.username;
  try {
    // FIND THE USER BY EMAIL
    const user = await User.findOne({username: userID});
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send({
      firstName: user.firstName,
      email: user.email,
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Server error");
  }
});

app.post("/signupdetails/:username", async (req, res) => {
  console.log(req.body.age);
  console.log(req.body.weight);
  const userID = req.params.username;
  const sex = req.body.sex;
  const age = req.body.age;
  const height = req.body.height;
  const weight = req.body.weight;
  const activityLevel = req.body.activityLevel;
  const goal = req.body.goal;

  try {
    const user = await User.findOneAndUpdate(
      // FIND BY EMAIL
      {username: userID},
      // SET THE MESSAGES TO THE UPDATED MESSAGES
      {
        $set: {
          userStats: {
            sex: sex,
            age: age,
            height: height,
            weight: weight,
            activityLevel: activityLevel,
            goal: goal,
          },
        },
      },

      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      // UPSERT: CREATES THE OBJECT IF IT DOESN'T EXIST OR UPDATES IT IF IT DOES.
      {new: true, upsert: true}
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Internal server error"});
  }
});

// STORES USER'S CHAT HISTORY TO THE DATABASE
app.put("/users/:username", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.username;
  // USERS CHAT HITORY
  const updatedUserData = req.body;

  try {
    const user = await User.findOneAndUpdate(
      // FIND BY EMAIL
      {username: userID},
      // SET THE MESSAGES TO THE UPDATED MESSAGES
      {$push: {messages: updatedUserData}},
      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      // UPSERT: CREATES THE OBJECT IF IT DOESN'T EXIST OR UPDATES IT IF IT DOES.
      {new: true, upsert: true}
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Internal server error"});
  }
});

// GETS THE USER'S CHAT HISTORY FROM THE DATABASE
app.get("/coach/:username", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.username;

  try {
    // FINDS THE USER BY USERNAME
    const user = await User.findOne({username: userID});
    if (!user) {
      return res.status(400).send("Username not registered: " + userID);
    }
    // GETS THE USER'S CHAT HISTORY
    const messages = user.messages;
    // STORES THE USER'S CHAT HISTORY
    const chatHistory = messages;
    // SENDS THE USER'S CHAT HISTORY
    res.json(chatHistory);
  } catch (e) {
    console.log(e);
  }
});

// to generate and store a user's workout plan
app.put("/fitness/:email", async (req, res) => {
  const userID = req.params.email;
  // const newWorkout = req.body;

  // call and execute workouts.js
  const workouts = require("./workouts");

  // generates workout plan in workout.js
  function generateWorkout(callback) {
    workouts.generate((newWorkout) => {
      updateWorkouts(newWorkout, callback);
    });
  }
  // writes workoutplan into database
  async function updateWorkouts(newWorkout, callback) {
    try {
      const user = await User.findOneAndUpdate(
        {email: userID},
        {$push: {workouts: {$each: [JSON.parse(newWorkout)], $position: 0}}}
      );
      res.status(200).json({
        message: `New workout added to ${userID}.`,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({error: "Internal server error"});
    }
    if (callback) {
      callback();
    }
  }
  generateWorkout();
});

// send workout plan to client
app.get("/fitness/:email", async (req, res) => {
  const userID = req.params.email;
  try {
    const user = await User.findOne({email: userID});
    if (user.workouts.length == 0) {
      res.send("empty");
    } else {
      res.send(user.workouts[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Internal server error"});
  }
});

// VARIABLES TO CHECK IF THE CURRENT DATE IS
// THE SAME AS THE DATE WHEN THE TIP WAS SELECTED
let selectedTip = null;
let selectedDate = null;

// GET TIPS FROM COLLECTION IN DATABASE
app.get("/home/tips", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().slice(0, 10);

    if (!selectedTip || selectedDate !== currentDate) {
      const tips = await Tips.aggregate([{$sample: {size: 1}}]);
      selectedTip = tips[0];
      selectedDate = currentDate;
    }

    res.status(200).json(selectedTip);
  } catch (err) {
    console.error(err);
    res.status(500).json({error: "Internal server error"});
  }
});

// RESET SELECTED TIP AND DATE AT MIDNIGHT
setInterval(() => {
  const currentDate = new Date().toISOString().slice(0, 10);

  if (selectedDate !== currentDate) {
    selectedTip = null;
    selectedDate = null;
  }
}, 1000 * 60 * 60 * 24);

// THE CURRENT AI IN THE COACH TAB
app.post("/", async (req, res) => {
  const {message} = req.body;
  console.log(message);

  // THE RESPONSE FROM OPENAI
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      `${message}` +
      `. Return response in the following parsable JSON format:
      [
      {
          "Day": "day",
          "item1": "item1",
          "item2": "item2",
          "item3": "item3",
          "item4": "item4",
          "planType": "fitness or diet"
      }
  ]

      `,
    max_tokens: 1000,
    temperature: 0,
  });

  const parsableJson = response.data.choices[0].text;

  console.log(parsableJson);

  const parsedJson = JSON.parse(parsableJson);
  let messageOutTest = "";

  // IF/ELSE THAT CHECKS IF THE PLAN IS A FITNESS PLAN OR DIET PLAN.
  // CURRENTLY ASSUMES THAT ANYTHING THAT IS NOT A FITNESS PLAN IS A DIET PLAN.
  parsedJson.forEach((choice) => {
    if (choice.planType === "fitness") {
      messageOutTest +=
        "Day: " +
        choice.Day +
        "\n" +
        "Exercise 1: " +
        choice.item1 +
        "\n" +
        "Exercise 2: " +
        choice.item2 +
        "\n" +
        "Exercise 3: " +
        choice.item3 +
        "\n" +
        "Rest: " +
        choice.item4 +
        "\n" +
        "\n";
    } else {
      messageOutTest +=
        "Day: " +
        choice.Day +
        "\n" +
        "BreakFast: " +
        choice.item1 +
        "\n" +
        "Lunch: " +
        choice.item2 +
        "\n" +
        "Dinner: " +
        choice.item3 +
        "\n" +
        "Snack: " +
        choice.item4 +
        "\n" +
        "\n";
    }
  });

  console.log(messageOutTest);

  // THE MESSAGE SENT TO THE USER
  res.json({
    message: messageOutTest,
  });
});

// server hosting
const localPort = 5050;
const port = process.env.PORT || localPort;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
// send server port info to client
app.get("/api/port", (req, res) => {
  res.json({port});
});
