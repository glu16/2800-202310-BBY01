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

// GETS THE USER'S DATA FROM THE DATABASE
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
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server error" });
  }
});

// GETS ALL THE USERS IN THE DATABASE
app.get("/leaderboard/users", async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, points: 1, _id: 1 });
    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GETS ALL OF THE LOGGED IN USER'S FRIENDS IN THE DATABASE
app.get("/leaderboard/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const loggedInUser = await User.findOne({ username });
    // CHECK IF THE USER IS LOGGED IN
    if (!loggedInUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // CHECK IF THE USER IS LOGGED IN
    const friends = await Promise.all(
      loggedInUser.friends.map(async (friend) => {
        const friendUser = await User.findById(friend._id);
        // SKIP DELETED USERS
        if (!friendUser) {
          // RETRIEVE THE DELETED USER WITH THE OLD USERNAME
          const deletedUser = await User.findOne({ username: friend.username });
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

        // RETURN THE EXISTING USERS
        return {
          username: friendUser.username,
          points: friend.points,
          _id: friend._id,
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
          longestStreak: 0,
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

// STORES USER'S CHAT HISTORY TO THE DATABASE
app.put("/users/:username", async (req, res) => {
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

// GETS THE USER'S CHAT HISTORY FROM THE DATABASE
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

// GET USERSTATS TO FEED INTO WORKOUT PLAN GENERATION
// app.get("/userStats/:username", async (req, res) => {
//   const userID = req.params.username;
//   try {
//     const user = await User.findOne({ username: userID });
//     let obj = user.userStats[0];

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error. Couldn't get userStats." });
//   }
// });

// GENERATE AND STORE WORKOUT PLAN FOR USER
app.put("/fitness/:username", async (req, res) => {
  // store user's username
  const userID = req.params.username;

  // store variables sent from fitness.jsx
  var { workoutKey, workout, muscleGroups, level } = req.body;

  // store user's stats to send to workouts.js
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
    return; // Stop execution after sending the response
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
      return; // Stop execution after sending the response
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal server error. Couldn't add SAITAMA workout plan.",
      });
      return; // Stop execution after sending the response
    }
  }
  // END OF SAITAMA EASTER EGG

  // variables to hold userStats
  var sex = userStats.sex;
  var age = userStats.age;
  var height = userStats.height;
  var weight = userStats.weight;
  var activityLevel = userStats.activityLevel;
  var goal = userStats.goal;

  // variables to hold fitness.jsx form variables
  if (!muscleGroups || muscleGroups.length == 0) {
    muscleGroups = ["all"];
  }
  if (!level || level.length == 0) {
    level = "intermediate";
  }

  // import workouts.js
  const workouts = require("./workouts");

  // generates workout plan in workout.js
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
  // writes workoutplan into database
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

// send workout plan to client
app.get("/fitness/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    // if workouts empty ie.new user
    if (user.workouts.length == 0) {
      res.send("empty");
      // sends first workout in workouts
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

// send userStreak to client
app.get("/streak/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    res.send({
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Internal server error. Couldn't send user streak." });
  }
});

// to generate and store a user's workout plan
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
    return; // Stop execution after sending the response
  }

  var sex = userStats.sex;
  var age = userStats.age;
  var height = userStats.height;
  var weight = userStats.weight;
  var activityLevel = userStats.activityLevel;
  var goal = userStats.goal;
  // call and execute workouts.js
  const Diet = require("./diet");

  // generates workout plan in workout.js
  function generateDiet(callback) {
    Diet.generate(sex, age, height, weight, activityLevel, goal, (newDiet) => {
      updateDiet(newDiet, callback);
    });
  }
  // writes workoutplan into database
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

// send workout plan to client
app.get("/diet/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    // if workouts empty ie.new user
    if (user.diets.length == 0) {
      res.send("empty");
      // sends first workout in workouts
    } else {
      res.send(user.diets[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/userStats", async (req, res) => {
  // THE USER'S USERNAME
  const userID = req.params.username;
  try {
    // FIND THE USER BY USERNAME
    // DEFAULT USERNAME IS "ndurano" UNTILL FIX
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

// GET TIPS FROM COLLECTION IN DATABASE
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

const challengesCache = {
  data: [],
  lastUpdated: null,
};

// GETS 3 RANDOM CHALLENGES FROM THE DATABASE
app.get("/home/challenges", async (req, res) => {
  try {
    // CHECK IF CHALLENGES NEED TO BE UPDATED
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    if (
      challengesCache.lastUpdated === null ||
      (currentHour === 0 && currentMinute < 5) ||
      (currentHour === 23 && currentMinute >= 55)
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
    // ADD THE CHALLENGE TO THE USER'S COLLECTION
    user.challenges.push({ challengeId, challenge, points });
    // SAVE THE CHANGES
    user.save();
    // SEND THE RESPONSE
    res.status(200).send("Challenge added successfully");
  } catch (error) {
    console.error("Error occurred while adding challenge:", error);
    res.status(500).send("An error occurred");
  }
});

// THE CURRENT AI IN THE COACH TAB
app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log(message);

  // THE RESPONSE FROM OPENAI
  const response = await openai.createCompletion({
    // DEFAULT IS "text-davinci-003"
    model: "davinci:ft-personal-2023-05-15-05-32-16",
    prompt: `${message}` + " &&&&&",
    max_tokens: 200,
    stop: ["#####", "&&&&&"],
  });

  const parsableJson = response.data.choices[0].text;

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
      // find user by username
      { username: userID },
      {
        // increment currentStreak FIELD BY 1
        $inc: { currentStreak: 1 },
        // set doneToday TO true
        $set: { doneToday: true },
      },
      // ENABLE NEW: TRUE TO RETURN THE UPDATED DOCUMENT
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Compare currentStreak with longestStreak and update longestStreak if necessary
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
      await user.save();
      console.log(`${userID} has a new longestStreak: ${user.longestStreak}`);
    }
    console.log(`Successfully updated ${userID}'s currentStreak and doneToday`);
    res.status(200).json({
      message: `${userID} currentStreak incremented successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Daily at 11:58 pm every day go through all users and if their doneToday is false then set their currentStreak to 0
cron.schedule("58 23 * * *", async () => {
  try {
    // Find all users
    const users = await User.find();

    // Iterate over each user
    for (const user of users) {
      if (user.doneToday == false) {
        // If doneToday is false, set currentStreak to 0
        user.currentStreak = 0;
      }
      // Save the updated user
      await user.save();
    }
    console.log("Users' currentStreaks updated.");
  } catch (err) {
    console.error("Error updating currentStreaks: ", err);
  }
});
// Daily at 12:01 AM every day go through all users and reset their doneToday to false
cron.schedule("1 0 * * *", async () => {
  try {
    // Find all users and update their `doneToday` field to false
    const users = await User.updateMany({}, { $set: { doneToday: false } });
    console.log("Resetting doneToday field for all users.");
    console.log(`${users.nModified} users updated successfully.`);
  } catch (err) {
    console.error("An error occurred while resetting doneToday field: ", err);
  }
});

// server hosting
const localPort = 5050;
const port = process.env.PORT || localPort;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
// send server port info to client
app.get("/api/port", (req, res) => {
  res.json({ port });
});
