/*
A LARGE MARJORITY OF THIS CODE THAT HOOKS UP THE 
SIGNIN/LOGIN WAS TAKEN FROM THE FOLLOWING YOUTUBE VIDEO
https://www.youtube.com/watch?v=HGgyd1bYWsE 
*/

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

const { User } = require('./models/users');



const cors = require("cors");
require("dotenv").config();

const port = 8000;

const configuration = new Configuration({
  organization: process.env.ORG,
  apiKey: process.env.AI,
});
const openai = new OpenAIApi(configuration);


//THE CONNECTION TO DATABASE
db();

//MIDDELWARE
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);


//GETS THE USER FROM THE EMAIL NEW CODE
app.put('/users/:email',  async (req, res) => {
  const userEmail = req.params.email;
  const updatedUserData = req.body;


  try {
    const user = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { messages: updatedUserData.messages } },
      { new: true, upsert: true }
    );
    
    // const user =  await User.updateOne({ email: userEmail, title: { $exists: false } }, { title: 'boss' });

    res.status(200).json({
      message: `User with email ${userEmail} updated successfully`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//END OF NEW CODE

app.get('/coach/:email', async(req, res) => {

  const userEmail = req.params.email;


  try{
  const user = await User.findOne({ email: userEmail });
  if(!user){
    return res.status(400).send('Email not registered' + userEmail);

  }
  const messages = user.messages;
  const chatHistory = messages;
  res.json(chatHistory);
  }catch(e){
    console.log(e);
  }

});
//to generate and store a user's workout plan
app.put('/fitness/:email',  async (req, res) => {
  const userEmail = req.params.email;
  // const newWorkout = req.body;

  // call and execute workouts.js
  const workouts = require('./workouts');

  function generateWorkout(callback) {
    workouts.generate((newWorkout) => {
      updateWorkouts(newWorkout, callback);
    });
  }

  async function updateWorkouts(newWorkout, callback) {
    
    // console.log("newWorkout: " + newWorkout);
    // console.log("typeof newWorkout: " + typeof newWorkout);
    // console.log("typeof JSON.parse(newWorkout): " + typeof JSON.parse(newWorkout));
    // console.log("newWorkout stringified: " + JSON.stringify(newWorkout));  
    // console.log("callback: " + callback);

    try {
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        // { $push: { workouts: newWorkout } }
        { $push: { workouts: { $each: [JSON.parse(newWorkout)], $position: 0 } } } 
      );
      res.status(200).json({
        message: `New workout added to ${userEmail}.`,
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
    if (callback) {
      callback();
    }
  }

  // call the updateWorkouts function
  generateWorkout();
  
});


app.post('/', async (req, res) => {
  const { message } = req.body;
  console.log(message);

  const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${message}` + `. Return response in the following parsable JSON format:
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

  //   const stringJson = JSON.stringify(parsableJson);

    const parsedJson = JSON.parse(parsableJson);
    let messageOutTest = "";

      parsedJson.forEach((choice) => {
        if(choice.planType === "fitness"){
          messageOutTest += "Day: " + choice.Day + "\n" +
          "Exercise 1: " + choice.item1 + "\n" +
          "Exercise 2: " + choice.item2 + "\n" +
          "Exercise 3: " + choice.item3 + "\n" +
          "Rest: " + choice.item4 + "\n" + "\n";

        }else{
          messageOutTest += "Day: " + choice.Day + "\n" +
          "BreakFast: " + choice.item1 + "\n" +
          "Lunch: " + choice.item2 + "\n" +
          "Dinner: " + choice.item3 + "\n" +
          "Snack: " + choice.item4 + "\n" +"\n";
        }
      });
 
    console.log(messageOutTest);


    res.json(
      {
      message: messageOutTest
      }
    );

});
 
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

