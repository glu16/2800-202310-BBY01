// make sure you add API_KEY to .env in server folder

// get api key from .env file
require('dotenv').config();

// import openAIAPI
// import { Configuration, OpenAIApi } from "openai"
const { Configuration, OpenAIApi } = require('openai');

// create "instance" of the ai model to use with API key
const openai = new OpenAIApi( new Configuration({
    apiKey: process.env.API_KEY
}))


// create progress wheel animation, code src: chatgpt
const PWD = ['|', '/', '-', '\\'];
let idx = 0;
let progressInterval;
const startProgress = () => {
    progressInterval = setInterval(() => {
        process.stdout.write('\r' + PWD[idx++ % PWD.length]);
    }, 100);
};
const stopProgress = () => {
    clearInterval(progressInterval);
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
};

// define input strings
const muscles = ['back', 'chest']; // replace with the user's personsalized list
const level = "intermediate"; // beginner, intermediate, expert
var inputPrompt = "Give me a " + level + " level, 7-day workout routine with a focus on the following muscle groups:" + muscles.join(', ') + ". ";

const environment = "indoor" // indoor, outdoor, either
inputPrompt += "I only want " + environment + " activities. ";

// const equipment = ['bike','gym'];
// inputPrompt += "\n In terms of equipment I am limited to " + equipment.join(', ');

inputPrompt += "Give me at least five exercises for each day. "
inputPrompt += "Give an estimated time required for each activity and a sum for all the activities each day. "
inputPrompt += "Give an estimated number of calories burned. "
inputPrompt += "Format each day with a number like Day 1 or Day 7. Do not use day names like Monday. "
inputPrompt += "Format each exercise with the following structure: exercise name, number of sets and reps, estimated time to complete, and calories burned. "

// console.log("Prompt: " + inputPrompt);

// run the AI
const runAI = async (input) => {
    
    // loading animation
    console.log("generating workout plan...");
    startProgress();  

    //default max tokens = 4096
    const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",  
    messages: [{ role: "user", content: input}]  
    })

    // loading animation
    stopProgress();  

    // store AI response
    var fullResponse;
    try {
        fullResponse = res.data.choices[0].message.content;
        // console.log("fullResponse: " + fullResponse);
      } catch (error) {
        console.error("Error generating fullResponse:", error);
      }

    //an array of paragraphs, '\n\n' is too inconsistent
    var paragraphs;
    try {
        paragraphs = fullResponse.split('Day '); 
        // console.log("paragraphs: " + paragraphs);
      } catch (error) {
        console.error("Error splitting fullResponse into paragraphs:", error);
      }

    // parse and save output as a JSON file
    var workoutPlan = {};
    try {
        for (let i = 1; i < paragraphs.length; i++) {  
            var day = paragraphs[i].split('\n'); //an array of sentences in this paragraph
            var exercises = {};
            for (let j = 1; j < day.length; j++) {  //starting j=1 because 1st line is unwanted
                
                // skips empty spaces and last total conclusion paragraph
                if (day[j].length < 3 || day[j].includes("Total")) {
                    // console.log("Skipped j=" + j);
                    continue;
                }

                // catch when exercise is empty
                
                var name;
                try {
                    name = day[j].substring(day[j].indexOf(" ") + 1, day[j].indexOf(","));
                    // console.log("name: " + name);
                  } catch (error) {
                    console.error("Error getting exercise name: ", error);
                    console.log("day[j]: " + JSON.stringify(day[j]));
                  }

                var setsAndReps;
                try {
                    setsAndReps = day[j].substring(day[j].indexOf("sets") - 2, day[j].indexOf("reps") + "reps".length);
                    // console.log("setsAndReps: " + setsAndReps);
                  } catch (error) {
                    console.error("Error getting exercise setsAndReps: ", error);
                    console.log("day[j]: " + JSON.stringify(day[j]));
                  }

                var calories = 0;
                try {
                    const matches = day[j].match(/\d+/g);
                    for (let i = 0; i < matches.length; i++) {
                        const num = parseInt(matches[i]); // Convert the matched string to a number
                        if (num > calories) { 
                        calories = num;
                        }
                    }
                    // console.log("calories: " + calories);
                  } catch (error) {
                    console.error("Error getting exercise calories: ", error);
                    console.log("day[j]: " + JSON.stringify(day[j]));
                  }
                // console.log("name: " + name + ", setsAndReps: " + setsAndReps + ", calories: " + calories);


                // catch any invalid exercise and skip adding it 
                if (name==null || setsAndReps==null || calories==null ||
                    calories == 0 || name.length < 4 || setsAndReps < 4) {
                    console.log("Invalid exercise tossed: " + day[j]);
                    continue;
                }

                var exercises_details = {};
                try {
                    exercises_details = Object.assign(exercises_details, {
                        ['name'] : name,
                        ['setsAndReps'] : setsAndReps,
                        ['calories'] : calories
                    })
                    // console.log("exercises_details: " + exercises_details);
                    exercises = Object.assign(exercises, {
                        // ["Exercise" + j] : day[j]
                        ["Exercise" + j] : exercises_details
                    });
                    // console.log("exercises: " + exercises);
                } catch (error) {
                    console.error("Error assigning exercises details to exercise object:", error);
                }
            }
            
            // assigns empty spaces as rest day correctly
            if (exercises == "{}") {
                exercises = "Rest day";
            }
            
            try {
                workoutPlan = Object.assign(workoutPlan, {
                    ["Day" + (i)] : exercises
                });
            } catch (error) {
                console.error("Error assigning exercises to workoutPlan object:", error);
            }
        }
    } catch (error) {
        console.error("Error parsing paragraphs into workout plan:", error);
    }

    // console.log(workoutPlan);
    console.log("...workout plan generated.");
    return(JSON.stringify(workoutPlan));
}

function generate(callback) {
    runAI(inputPrompt).then((result) => {
        const newWorkout = result;
        callback(newWorkout);
      });
}

module.exports = {
    generate: generate
  };