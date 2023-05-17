/* 
A LARGE MARJORITY OF THIS CODE THAT HOOKS UP OPENAI
TO THE FONTEND WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
https://www.youtube.com/watch?v=qwM23_kF4v4
*/

const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const app = express();
const db = require("./database.js");
const userRouter = require("./routes/users.js");
const authRouter = require("./routes/auth.js");
const passChangeRouter = require("./routes/passChange.js");

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

// TO GENERATE AND STORE A USER'S WORKOUT PLAN
app.put("/fitness/:username", async (req, res) => {
  const userID = req.params.username;
  // console.log(userID);
  // const newWorkout = req.body;

  // CALL AND EXECUTE workouts.js
  const workouts = require("./workouts.js");

  // GENERATES WORKOUT PLAN IN workout.js
  function generateWorkout(callback) {
    workouts.generate((newWorkout) => {
      updateWorkouts(newWorkout, callback);
    });
  }
  // WRITES WORKOUT PLAN INTO THE DATABASE
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
      console.log("pushed into ");
      res.status(200).json({
        message: `New workout added to ${userID}.`,
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
  generateWorkout();
});

// SEND WORKOUT PLAN TO CLIENT
app.get("/fitness/:username", async (req, res) => {
  const userID = req.params.username;
  try {
    const user = await User.findOne({ username: userID });
    // IF WORKOUTS IS EMPTY (ex. NEW USER)
    if (user.workouts.length == 0) {
      res.send("empty");
      // SENDS FIRST WORKOUT IN WORKOUTS
    } else {
      res.send(user.workouts[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// TO GENERATE AND STORE A USER'S DIET PLAN
app.put("/diet/:email", async (req, res) => {
  const userID = req.params.email;
  // const newWorkout = req.body;

  // CALL AND EXECUTE diet.js
  const Diet = require("./diet.js");

  // GENERATES DIET PLAN IN diet.js
  function generateDiet(callback) {
    Diet.generate((newDiet) => {
      updateDiet(newDiet, callback);
    });
  }
  // WRITES DIET PLAN INTO THE DATABASE
  async function updateDiet(newDiet, callback) {
    try {
      const user = await User.findOneAndUpdate(
        { email: userID },
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

// SEND DIET PLAN TO CLIENT
app.get("/diet/:email", async (req, res) => {
  const userID = req.params.email;
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

// GETS 3 RANDOM MINI CHALLENGES FROM THE DATABASE THAT CHANGES AT MIDNIGHT
app.get("/home/challenges", async (req, res) => {
  try {
    const currentDate = new Date();
    const midnight = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
      0,
      0,
      0
    );
    const timeUntilMidnight = midnight.getTime() - currentDate.getTime();

    // WAIT UNTIL MIDNIGHT TO REFRESH THE CHALLENGES
    await new Promise((resolve) => setTimeout(resolve, timeUntilMidnight));

    // GET TOTAL COUNT OF CHALLENGES
    const count = await Challenges.countDocuments();
    console.log("Total challenges count:", count);

    // GENERATE 3 RANDOM NUMBERS
    const randomNumbers = [];
    while (randomNumbers.length < 3) {
      const randomNumber = Math.floor(Math.random() * count);
      if (!randomNumbers.includes(randomNumber)) {
        randomNumbers.push(randomNumber);
      }
    }

    // RETRIEVE CHALLENGES USING THE RANDOM NUMBERS
    const challenges = await Challenges.find()
      .limit(3)
      .skip(randomNumbers[0])
      .toArray();

    // EXTRACT THE PROPERTIES
    const challengeData = challenges.map((challenge) => ({
      stringValue: challenge.String,
      intValue: challenge.int,
    }));

    // SEND THE CHALLENGE DATA
    res.json(challengeData);
  } catch (error) {
    console.error(error);
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

// SERVER HOSTING
const localPort = 5050;
const port = process.env.PORT || localPort;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
// SEND SERVER PORT INTO TO THE CLIENT
app.get("/api/port", (req, res) => {
  res.json({ port });
});
