/* 
A LARGE MARJORITY OF THIS CODE THAT HOOKS UP OPENAI
TO THE FONTEND WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
https://www.youtube.com/watch?v=qwM23_kF4v4
*/

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const app = express();
const db = require("./database.js");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const passChangeRouter = require("./routes/passChange");

// THE MODELS
const { User } = require("./models/users.js");
const Tips = require("./models/tips.js");
const Challenges = require("./models/challenges.js");

const cors = require("cors");
require("dotenv").config();

//OPENAI CONFIGURATION
const configuration = new Configuration({
  organization: process.env.ORG,
  apiKey: process.env.AI,
});
const openai = new OpenAIApi(configuration);

// FOR TIME-BASED AUTO METHODS
const cron = require("node-cron");

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
    const user = await User.findOne({ email: userID });
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

app.get("/coachPic/:username", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.username;

  try {
    // FINDS THE USER BY EMAIL
    const user = await User.findOne({ username: userID });
    if (!user) {
      return res.status(400).send("Email not registered" + userID);
    }
    //REPLACE 'REPLACE_ME' WITH KEY OF DATA YOU WANT TO GET
    const item = user.imageURL;
    res.json(item);
  } catch (e) {
    console.log(e);
  }
});

// RETRIEVES THE USER'S DATA FROM THE DATABASE
app.get("/users/:username", async (req, res) => {
  // THE USER'S USERNAME
  const userID = req.params.username;
  try {
    // FIND THE USER BY USERNAME
    const user = await User.findOne({ username: userID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send({
      username: user.username,
      firstName: user.firstName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      userStats: user.userStats,
      imageURL: user.imageURL,
      userStats: user.userStats,
      points: user.points,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

// ADDS THE CHALLENGE POINTS TO THE USER'S POINTS IN THE DATABASE
app.put("/users/:username", async (req, res) => {
  const { username } = req.params;
  const { points } = req.body;
  try {
    // FIND THE USER BY USERNAME
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // GET THE CURRENT POINTS FROM THE USER
    const currentPoints = user.points;

    // ADD THE CHALLENGE POINTS TO THE USER'S CURRENT POINTS
    const updatedPoints = currentPoints + points;

    // UPDATE THE USER'S POINTS
    user.points = updatedPoints;

    // SAVE THE CHANGES
    await user.save();

    res.json({ message: "User points updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating user points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVES ALL THE USERS IN THE DATABASE
app.get("/leaderboard/users", async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, points: 1, _id: 1, imageURL: 1});
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// RETRIEVES ALL OF THE LOGGED IN USER'S FRIENDS IN THE DATABASE
app.get("/leaderboard/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = await User.findOne({ username });
    // CHECK IF THE USER IS LOGGED IN
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = await Promise.all(
      loggedInUser.friends.map(async (friend) => {
        const friendUser = await User.findOne({ _id: friend._id });
        // CHECKS IF FRIEND WAS DELETED
        if (!friendUser) {
          const deletedUser = await User.findOne({ username: friend.username });
          // SKIP DELETED USERS
          if (!deletedUser) {
            return null;
          }
          // RETURN THE NEW USER INFORMATION WITH THE OLD USERNAME
          return {
            username: friend.username,
            points: deletedUser.points,
            _id: deletedUser._id,
          };
        }
        // RETRIEVES THE FRIEND'S POINTS
        const friendPoints = friendUser.points;
        // RETURN THE EXISTING USERS
        return {
          username: friendUser.username,
          points: friendPoints,
          _id: friendUser._id,
          imageURL: friendUser.imageURL,
        };
      })
    );
    // CHECK TO SEE IF THE FRIEND'S USERNAME IS NULL
    const validFriends = friends.filter((friend) => friend !== null);
    // SEND THE REQUEST RESPONSE
    res.json(validFriends);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// RETRIEVES USER'S NOTIFICATION SETTINGS FROM DATABASE
app.get("/settings/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });

    if (!user) {
      res.status(404).send("User not found");
    }
    const settings = user.notificationSettings[0];
    if (!settings) {
      res.send({
        dietReminders: false,
        fitnessReminders: false,
        leaderboardReminders: false,
        challengeReminders: false,
      });
    } else {
      res.send({
        dietReminders: settings.dietReminders,
        fitnessReminders: settings.fitnessReminders,
        leaderboardReminders: settings.leaderboardReminders,
        challengeReminders: settings.challengeReminders,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// UPDATES AND SAVES THE LOGGED IN USER'S NAME INTO THE SPECIFIED USER'S COLLECTION
app.post("/leaderboard/:friendUsername", async (req, res) => {
  const { friendUsername } = req.params;
  const { username } = req.body;
  try {
    // FIND THE FRIEND BY USERNAME
    const friend = await User.findOne({ username: friendUsername });
    // THROW ERROR IF SELECTED USER CANNOT BE FOUND
    if (!friend) {
      return res.status(404).json({ error: "Friend not found" });
    }
    // FIND THE LOGGED IN USER
    const loggedInUser = await User.findOne({ username });
    // CHECK IF THE LOGGED IN USER IS TRYING TO ADD THEMSELVES AS A FRIEND
    if (friendUsername === username) {
      return res
        .status(400)
        .json({ error: "Cannot add yourself as a friend." });
    }
    // CHECK IF THE FRIEND OBJECT ALREADY EXISTS IN THE LOGGED IN USER'S ARRAY
    if (!loggedInUser.friends.some((f) => f.username === friend.username)) {
      loggedInUser.friends.push({
        username: friend.username,
        points: friend.points,
        _id: friend._id,
      });
    }
    // CHECK IF THE LOGGED IN USER OBJECT ALREADY EXISTS IN THE FRIEND'S ARRAY
    if (!friend.friends.some((f) => f.username === loggedInUser.username)) {
      friend.friends.push({
        username: loggedInUser.username,
        points: loggedInUser.points,
        _id: loggedInUser._id,
      });
    }
    // SAVE BOTH THE LOGGED IN USER AND FRIEND
    await Promise.all([loggedInUser.save(), friend.save()]);

    // SEND THE REQUEST RESPONSE
    res.status(200).json({
      message: "Friend added successfully",
      friend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETES THE SPECIFIED USER FROM THE FRIENDS ARRAY FOR BOTH
app.delete("/profile/:friendId", async (req, res) => {
  const { friendId } = req.params;
  const { username } = req.body;
  try {
    console.log("Received DELETE request");
    console.log("Friend ID:", friendId);
    console.log("Username:", username);
    // FIND THE LOGGED IN USER BY USERNAME
    const loggedInUser = await User.findOne({ username });
    // THROWS ERROR IF NOT LOGGED IN
    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // FIND THE FRIEND IN THE LOGGED IN USER'S FRIEND LIST
    const friendIndex = loggedInUser.friends.findIndex(
      (friend) => friend._id.toString() === friendId
    );
    if (friendIndex === -1) {
      return res.status(404).json({ error: "Friend not found" });
    }
    // REMOVE THE FRIEND FROM THE USER'S FRIEND LIST
    loggedInUser.friends.splice(friendIndex, 1);
    // SAVE THE UPDATED USER
    await loggedInUser.save();
    // FIND THE FRIEND BY ID
    const friend = await User.findById(friendId);
    // FIND THE LOGGED IN USER IN THE FRIEND'S FRIEND LIST
    const loggedInUserIndex = friend.friends.findIndex(
      (friend) => friend._id.toString() === loggedInUser._id.toString()
    );
    if (loggedInUserIndex === -1) {
      return res.status(404).json({ error: "Friend not found" });
    }
    // REMOVE THE LOGGED IN USER FROM THE FRIEND'S FRIEND LIST
    friend.friends.splice(loggedInUserIndex, 1);
    // SAVED THE UPDATED FRIEND
    await friend.save();

    // SEND THE RESPONSE
    res.status(200).json({
      message: "Friend removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVES THE USER'S CHALLENGES FROM THE DATABASE
app.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    // FIND THE LOGGED IN USER BY USERNAME
    const user = await User.findOne({ username });
    // THROW AN ERROR IF THE USER IS NOT FOUND
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // RETRIEVE THE CHALLENGES ARRAY
    const { challenges } = user;
    // RETRIEVE THE CHALLENGES ARRAY BASED ON THE CHALLENGE IDs
    const challengeDocuments = await Challenges.find(
      { _id: { $in: challenges.map((challenge) => challenge.challengeId) } },
      { challengeId: 1, challenge: 1, points: 1 }
    );
    // SEND THE RESPONSE
    res.json(challengeDocuments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// GENERATES USER STATS AND SAVES IT IN THE DATABASE
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
      { username: userID },
      // SET THE USER STATS
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
          doneToday: false,
          currentStreak: 0,
          longesstStreak: 0,
        },
      },

      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      // UPSERT: CREATES THE OBJECT IF IT DOESN'T EXIST OR UPDATES IT IF IT DOES.
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signupPrefRes/:username", async (req, res) => {
  const userID = req.params.username;
  const foodPref = req.body.foodPreferences;
  const foodRes = req.body.dietaryRestrictions;
  // const workoutPref = req.body.workoutPreferences;
  // const workoutRes = req.body.workoutRestrictions;

  try {
    const user = await User.findOneAndUpdate(
      // FIND BY EMAIL
      { username: userID },
      // SET THE USER STATS
      {
        $set: {
          "userStats.0.foodPref": foodPref,
          "userStats.0.foodRes": foodRes,
          // "userStats.0.workoutPref": workoutPref,
          // "userStats.0.workoutRes": workoutRes,
        },
      },

      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      // UPSERT: CREATES THE OBJECT IF IT DOESN'T EXIST OR UPDATES IT IF IT DOES.
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATES AND SAVES THE USER'S PROFILE INFORMATION IN THE DATABASE
app.post("/profile/:username", async (req, res) => {
  const userID = req.params.username;
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      // FIND BY EMAIL
      { username: userID },
      // SETS THE USER'S PROFILE INFORMATION
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          phoneNumber: req.body.phoneNumber,
          "userStats.0.age": req.body.age,
          "userStats.0.height": req.body.height,
          "userStats.0.weight": req.body.weight,
          "userStats.0.foodPref": req.body.foodPref,
          "userStats.0.foodRes": req.body.foodRes,
          // "userStats.0.workoutPref": req.body.workoutPref,
          // "userStats.0.workoutRes": req.body.workoutRes,
        },
      },

      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      { new: true }
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    // RETURNS ERROR MESSAGE BASED ON ERR OBJECT PROPERTIES
    if (err.codeName == "DuplicateKey" && err.keyValue.username) {
      res.status(500).send("Username is already taken");
    } else if (err.codeName == "DuplicateKey" && err.keyValue.email) {
      res.status(500).send("Email is already taken");
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

// UPDATES AND SAVES DOWNLOAD LINK FOR PROFILE PICTURE FOR USER IN DATABASE
app.post("/pfp/:username", async (req, res) => {
  const userID = req.params.username;
  console.log(req.body.image);
  try {
    if (req.body == "") {
      res.status(404).send("Please try uploading your image again.");
    }
    const user = await User.findOneAndUpdate(
      // FIND BY EMAIL
      { username: userID },
      // SETS THE USER'S IMAGE DOWNLOAD LINK
      {
        $set: {
          imageURL: req.body.image,
        },
      },
      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      { new: true }
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal server error (Image URL was not saved)" });
  }
});

// UPDATES USER NOTIFICATION SETTINGS IN DATABASE
app.post("/settings/:username", async (req, res) => {
  const userID = req.params.username;
  console.log(req.body.challengeReminders);
  try {
    if (!req.body) {
      res.status(404).send("No settings received.");
    }
    await User.findOneAndUpdate(
      { username: userID },
      {
        $set: {
          notificationSettings: {
            dietReminders: req.body.dietReminders,
            fitnessReminders: req.body.fitnessReminders,
            leaderboardReminders: req.body.leaderboardReminders,
            challengeReminders: req.body.challengeReminders,
          },
        },
      },
      { new: true, upsert: true }
    );
    console.log(`settings updated`);
    res.status(200).send("Notification settings successfully updated");
  } catch (error) {
    res.status(500).json({
      error: "Internal server error (Notification settings were not saved",
    });
  }
});

// STORES USER'S CHAT HISTORY TO THE DATABASE
app.put("/history/:username", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.username;
  // USERS CHAT HITORY
  const updatedUserData = req.body;

  try {
    const user = await User.findOneAndUpdate(
      // FIND BY EMAIL
      { username: userID },
      // SET THE MESSAGES TO THE UPDATED MESSAGES
      { $push: { messages: updatedUserData } },
      // NEW: RETURNS THE MODIFIED DOCUMENT RATHER THAN THE ORIGINAL.
      // UPSERT: CREATES THE OBJECT IF IT DOESN'T EXIST OR UPDATES IT IF IT DOES.
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: `User with username ${userID} updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// RETRIEVES THE USER'S CHAT HISTORY FROM THE DATABASE
app.get("/coach/:username", async (req, res) => {
  // THE USER'S EMAIL
  const userID = req.params.username;

  try {
    // FINDS THE USER BY USERNAME
    const user = await User.findOne({ username: userID });
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

// GENERATE AND STORE WORKOUT PLAN FOR USER
app.put("/fitness/:username", async (req, res) => {
  // STORE USER'S USERNAME
  const userID = req.params.username;

  // STORE VARIABLES SENT FROM FITNESS.JSX
  var { workoutKey, workout, muscleGroups, level } = req.body;

  // STORE USER'S STATS TO SEND TO WORKOUTS.JS
  var userStats;
  var firstName;
  try {
    const user = await User.findOne({ username: userID });
    userStats = user.userStats[0];
    firstName = user.firstName;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't get userStats." });
    // STOP EXECUTION AFTER SENDING THE RESPONSE
    return;
  }

  // SAITAMA EASTER EGG
  const today = new Date();
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);
  var saitamaWorkout = {};
  saitamaWorkout[formattedDate] = {
    "Exercise 1": { name: "PUSH-UPS", setsAndReps: "100", calories: 100 },
    "Exercise 2": { name: "SIT-UPS", setsAndReps: "100", calories: 100 },
    "Exercise 3": { name: "SQUATS", setsAndReps: "100", calories: 100 },
    "Exercise 4": { name: "10K RUN", setsAndReps: "10 km", calories: 900 },
  };
  if (firstName.toLowerCase() === "saitama") {
    console.log(saitamaWorkout);
    try {
      const user = await User.findOneAndUpdate(
        { username: userID },
        {
          $push: {
            workouts: {
              $each: [JSON.parse(JSON.stringify(saitamaWorkout))],
              $position: 0,
            },
          },
        }
      );
      res.status(200).json({
        message: `SAITAMA'S WORKOUT ADDED.`,
        user,
      });
      // STOP EXECUTION AFTER SENDING THE RESPONSE
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal server error. Couldn't add SAITAMA workout plan.",
      });
      // STOP EXECUTION AFTER SENDING THE RESPONSE
      return;
    }
  }
  // END OF SAITAMA EASTER EGG

  // VARIABLES TO HOLD USER STATS
  var sex = userStats.sex;
  var age = userStats.age;
  var height = userStats.height;
  var weight = userStats.weight;
  var activityLevel = userStats.activityLevel;
  var goal = userStats.goal;

  // VARIABLES TO HOLD FITNESS.JSX FORM VARIABLES
  if (!muscleGroups || muscleGroups.length == 0) {
    muscleGroups = ["all"];
  }
  if (!level || level.length == 0) {
    level = "intermediate";
  }

  // IMPORT WORKOUTS.JS
  const workouts = require("./workouts");

  // GENERATES WORKOUT PLAN IN WORKOUTS.JS
  function generateWorkout(callback) {
    workouts.generate(
      sex,
      age,
      height,
      weight,
      activityLevel,
      goal,
      muscleGroups,
      level,
      (newWorkout) => {
        updateWorkouts(newWorkout, callback);
      }
    );
  }
  // WRITES WORKOUT PLAN INTO DATABASE
  async function updateWorkouts(newWorkout, callback) {
    try {
      const user = await User.findOneAndUpdate(
        { username: userID },
        {
          $push: {
            workouts: { $each: [JSON.parse(newWorkout)], $position: 0 },
          },
        }
      );
      res.status(200).json({
        message: `New workout added to ${userID}.`,
        user,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Internal server error. Couldn't add workout plan." });
    }
    if (callback) {
      callback();
    }
  }
  generateWorkout();
});

// RETRIEVES THE WORKOUT PLAN FOR THE USER
app.get("/fitness/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    // IF WORKOUTS EMPTY IE.NEW USER
    if (user.workouts.length == 0) {
      res.send("empty");
      // SENDS FIRST WORKOUT IN WORKOUTS
    } else {
      res.send(user.workouts[0]);
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't send workout plan." });
  }
});

// GET THE USER'S SEX FOR MODAL IMAGES
app.get("/getSex/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    var sex = JSON.stringify(user.userStats[0].sex)
    res.send(sex);
    // console.log(`Sent ${userID}'s sex: ${sex}`);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't send user's sex." });
  }
});


// RETRIEVES THE DIET PLAN FOR THE USER
app.get("/diet/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    // IF WORKOUTS EMPTY IE.NEW USER
    if (user.diets.length == 0) {
      res.send("empty");
      // SENDS FIRST WORKOUT IN WORKOUTS
    } else {
      res.send(user.diets[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GETS THE USER'S WORKOUT COMPLETION STREAK
app.get("/streak/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    res.send({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      doneToday: user.doneToday,
      daysDone: user.daysDone,
      daysMissed: user.daysMissed,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't send user streak." });
  }
});

// RETRIEVES THE USER'S COMPLETED WORKOUTS
app.get("/doneToday/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    res.send(user.doneToday);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't send doneToday." });
  }
});

// RETRIEVES THE USER'S FIRST NAME AND LAST NAME
app.get("/getName/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    res.send({
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't send doneToday." });
  }
});

// GENERATES AND STORES A USER'S WORKOUT PLAN
app.put("/diet/:username", async (req, res) => {
  const userID = req.params.username;

  var userStats;
  var firstName;
  try {
    const user = await User.findOne({ username: userID });
    userStats = user.userStats[0];
    console.log(userStats);
    firstName = user.firstName;
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't get userStats." });
    // STOP EXECUTION AFTER SENDING THE RESPONSE
    return;
  }

  var sex = userStats.sex;
  var age = userStats.age;
  var height = userStats.height;
  var weight = userStats.weight;
  var activityLevel = userStats.activityLevel;
  var goal = userStats.goal;
  var foodPref = userStats.foodPref;
  var foodRes = userStats.foodRes;
  // CALL AND EXECUTE WORKOUTS.JS
  const Diet = require("./diet");

  // GENERATES DIET PLAN IN diet.js
  function generateDiet(callback) {
    Diet.generate(
      sex,
      age,
      height,
      weight,
      activityLevel,
      goal,
      foodPref,
      foodRes,
      (newDiet) => {
        updateDiet(newDiet, callback);
      }
    );
  }
  // WRITES WORKOUT PLAN INTO DATABASE
  async function updateDiet(newDiet, callback) {
    try {
      const user = await User.findOneAndUpdate(
        { username: userID },
        { $push: { diets: { $each: [JSON.parse(newDiet)], $position: 0 } } }
      );
      res.status(200).json({
        message: `New diet added to ${userID}.`,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
    if (callback) {
      callback();
    }
  }
  generateDiet();
});

// RETRIEVES THE USER'S USER STATS
app.get("/userStats", async (req, res) => {
  // THE USER'S USERNAME
  const userID = req.params.username;
  try {
    // FIND THE USER BY USERNAME
    // DEFAULT USERNAME IS "ndurano" UNTIL FIX
    const user = await User.findOne({ username: "ndurano" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send({
      sex: user.userStats[0].sex,
      age: user.userStats[0].age,
      height: user.userStats[0].height,
      weight: user.userStats[0].weight,
      activityLevel: user.userStats[0].activityLevel,
      goal: user.userStats[0].goal,
      foodPref: user.userStats[0].foodPref,
      foodRes: user.userStats[0].foodRes,
      // workoutPref: user.userStats[0].workoutPref,
      // workoutRes: user.userStats[0].workoutRes,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

// VARIABLES TO CHECK IF THE CURRENT DATE IS
// THE SAME AS THE DATE WHEN THE TIP WAS SELECTED
let selectedTip = null;
let selectedDate = null;

// RETRIEVES A TIP FROM THE TIP COLLECTION IN DATABASE
app.get("/home/tips", async (req, res) => {
  try {
    const currentDate = new Date().toISOString().slice(0, 10);

    if (!selectedTip || selectedDate !== currentDate) {
      const tips = await Tips.aggregate([{ $sample: { size: 1 } }]);
      selectedTip = tips[0];
      selectedDate = currentDate;
    }

    res.status(200).json(selectedTip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
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

// CREATES A GLOBAL CACHE OBJECT TO STORE THE CHALLENGES FOR ALL USERS
let challengesCache = {
  data: [],
  lastUpdated: null,
};

// RETRIEVES 3 RANDOM CHALLENGES FOR THE LOGGED-IN USER
app.get("/home/challenges/:username", async (req, res) => {
  try {
    const username = req.params.username;
    // FIND USER BY USERNAME
    const user = await User.findOne({ username });
    // THROW ERROR IF USER IS NOT FOUND
    if (!user) {
      throw new Error("User not found");
    }
    // CHECK IF CHALLENGES NEED TO BE UPDATED
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    if (
      (currentDayOfWeek === 0 &&
        currentHour === 0 &&
        currentMinute >= 0 &&
        currentMinute < 5) ||
      isCacheExpired(challengesCache.lastUpdated) ||
      !challengesCache.data
    ) {
      // RANDOMIZES THE 3 CHALLENGES FROM THE COLLECTION
      const challenges = await Challenges.aggregate([
        { $sample: { size: 3 } },
        { $project: { _id: 1, challenge: 1, points: 1 } },
      ]);

      // UPDATE THE CHALLENGES CACHE
      challengesCache.data = challenges;
      challengesCache.lastUpdated = currentDate;
    }

    // SEND THE RESPONSE
    res.json(challengesCache.data);
  } catch (error) {
    console.error("Error occurred during aggregation:", error);
    res.status(500).send("An error occurred");
  }
});

// HELPER FUNCTION TO CHECK IF THE CACHE IS EXPIRED (SUNDAY AT MIDNIGHT)
function isCacheExpired(lastUpdated) {
  const expirationDate = new Date(lastUpdated);
  expirationDate.setHours(23, 59, 59, 999);
  const currentDateTime = new Date();
  return currentDateTime > expirationDate;
}

// UPDATES AND SAVES CHALLENGE INTO USER'S COLLECTION
app.post("/home/challenges/:username", async (req, res) => {
  try {
    const { challengeId, challenge, points } = req.body;
    const username = req.params.username;
    // FIND USER BY USERNAME
    const user = await User.findOne({ username });
    // THROW ERROR IF USER IS NOT FOUND
    if (!user) {
      throw new Error("User not found");
    }
    // CREATE THE ARRAY FOR THE USER IF IT DOES NOT EXIST
    if (!user.challenges) {
      user.challenges = [];
    }
    // CHECK IF THE CHALLENGE ALREADY EXISTS IN THE USER'S COLLECTION
    const existingChallenge = user.challenges.find(
      (ch) => ch.challengeId === challengeId
    );
    if (existingChallenge) {
      throw new Error("Challenge already added");
    }
    // ADD THE CHALLENGE TO THE USER'S COLLECTION
    user.challenges.push({ challengeId, challenge, points });
    // SAVE THE CHANGES
    await user.save();
    // SEND THE RESPONSE
    res.status(200).send("Challenge added successfully");
  } catch (error) {
    console.error("Error occurred while adding challenge:", error);
    res.status(500).send("An error occurred");
  }
});

// REMOVES THE COMPLETED CHALLENGE FROM THE USER'S COLLECTION
app.delete("/home/challenges/:username/:challengeId", async (req, res) => {
  try {
    const username = req.params.username;
    const challengeId = req.params.challengeId;
    console.log("Challenge from params: " + challengeId);
    // FIND THE USER IN THE DATABASE
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // FIND THE INDEX OF THE CHALLENGE IN THE USER'S CHALLENGES ARRAY
    const challengeIndex = user.challenges.findIndex((challenge, index) => {
      console.log(index);
      console.log("Challenge ID: " + challenge.challengeId);
      console.log("_Id: " + challenge._id);
      console.log(" ");
      return challenge.challengeId.toString() == challengeId;
    });

    if (challengeIndex === -1) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    // REMOVE THE CHALLENGE FROM THE USER'S CHALLENGES ARRAY
    user.challenges.splice(challengeIndex, 1);

    // SAVE THE UPDATE
    await user.save();

    return res.status(200).json({ message: "Challenge removed successfully" });
  } catch (error) {
    console.error("Error occurred while removing challenge:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// THE CURRENT AI IN THE COACH TAB
app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log(message);

  // THE RESPONSE FROM OPENAI
  //.createCompletion // BASE MODEL
  const response = await openai.createChatCompletion({
    // model: "text-davinci-003", //BASE MODEL
    model: "gpt-3.5-turbo",
    // prompt: `${message}`, //BASE MODEL
    messages: [{ role: "user", content: `${message}` }],
    max_tokens: 200,
    presence_penalty: 0.6,
    frequency_penalty: 0.6,
  });

  // const parsableJson = response.data.choices[0].text; //BASE MODEL
  const parsableJson = response.data.choices[0].message.content;

  console.log(parsableJson);
  let messageOutTest = parsableJson;

  // THE MESSAGE SENT TO THE USER
  res.json({
    message: messageOutTest,
  });
});

// FOR STREAK TRACKER
app.post("/fitness/:username", async (req, res) => {
  const userID = req.params.username;
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      // FIND USER BY USERNAME
      { username: userID },
      {
        // INCREMENT currentStreak AND daysDone FIELD BY 1 AND award 100 points
        $inc: { currentStreak: 1, daysDone: 1, points: 100 },
        // SET doneToday TO true
        $set: { doneToday: true },
      },
      // ENABLE NEW: TRUE TO RETURN THE UPDATED DOCUMENT
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // COMPARE currentStreak WITH longestStreak AND UPDATE longestStreak IF NECESSARY
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
      // aware extra 50 points if new streak
      user.points = user.points + 50;
      await user.save();
      console.log(`${userID} has a new longestStreak: ${user.longestStreak}`);
    }
    console.log(
      `Successfully updated ${userID}'s currentStreak, daysDone, and doneToday`
    );
    res.status(200).json({
      message: `${userID} streak stats updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Daily at 12:01AM update streaks for all users <- TARGET THIS METHOD WITH CRON-JOB EXTERNALLY ONCE HOSTED
app.post("/updateStreaks", async (req, res) => {
  // HANDLE WHETHER USER COMPLETED OR DID NOT COMPLETE THEIR WORKOUT TODAY
  try {
    // FIND ALL USERS AND ITERATE THROUGH THEM
    const users = await User.find();
    for (const user of users) {
      if (user.doneToday) {
        // IF THE USER COMPLETED A WORKOUT TODAY, INCREMENT daysDone
        user.daysDone++;
      } else {
        // IF THE USER DID NOT COMPLETE A WORKOUT TODAY, UPDATE currentStreak AND daysMissed
        user.currentStreak = 0;
        user.daysMissed++;
      }
      // SAVE THE UPDATED USER
      await user.save();
      // console.log(`${user.username} streak updated.`);
    }
    console.log("All streaks updated successfully.");
  } catch (err) {
    console.error("Failed to update streaks: ", err);
  }

  // FINALLY RESET ALL USER'S doneToday TO false
  try {
    await User.updateMany(
      {},
      {
        doneToday: false,
      }
    );
    console.log("All doneToday reset to false successfully.");
  } catch (error) {
    console.log("Failed to reset donetToday:" + error);
  }
});

// SERVER HOSTING
const localPort = 5050;
const port = process.env.PORT || localPort;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
// SEND SERVER PORT INFO TO CLIENT
app.get("/api/port", (req, res) => {
  res.json({ port });
});
