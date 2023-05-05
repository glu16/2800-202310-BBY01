// make sure you add API_KEY to .env in server folder

console.log("generated workout plan");

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

inputPrompt += "Give an estimated time required for each activity and a sum for all the activities each day. "
inputPrompt += "Give an estimated number of calories burned. "
inputPrompt += "Format each day with a number like Day 1 or Day 7. Do not use day names like Monday. "
inputPrompt += "Format each exercise with the following structure: exercise name, number of sets and reps, estimated time to complete, and calories burned. "

// console.log("Prompt: " + inputPrompt);

// run the AI
const runAI = async (input) => {
    
    // loading animation
    console.log("loading...");
    startProgress();  

    //default max tokens = 4096
    const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",  
    messages: [{ role: "user", content: input}]  
    })

    // loading animation
    stopProgress();  

    // store AI response
    const fullResponse = res.data.choices[0].message.content
    // console.log(fullResponse);

    const paragraphs = fullResponse.split('Day '); //an array of paragraphs, '\n\n' is too inconsistent

    // parse and save output as a JSON file
    var workoutPlan = {};
    for (let i = 1; i < paragraphs.length; i++) {  
        var day = paragraphs[i].split('\n'); //an array of sentences in this paragraph
        var exercises = {};
        for (let j = 1; j < day.length; j++) {  //starting j=1 because 1st line is unwanted
            
            if (day[j].length < 3 || day[j].includes("Total")) {
                // console.log("Skipped j=" + j);
                continue;
            }
            
            var name = day[j].substring(day[j].indexOf(" ") + 1, day[j].indexOf(","));
            var setsAndReps = day[j].substring(day[j].indexOf("sets") - 2, day[j].indexOf("reps") + "reps".length);
            var calories = 0;
            const matches = day[j].match(/\d+/g);
            for (let i = 0; i < matches.length; i++) {
                const num = parseInt(matches[i]); // Convert the matched string to a number
                if (num > calories) { 
                  calories = num;
                }
              }
            // console.log("name: " + name + ", setsAndReps: " + setsAndReps + ", calories: " + calories);

            var exercises_details = {};
            exercises_details = Object.assign(exercises_details, {
                ['name'] : name,
                ['setsAndReps'] : setsAndReps,
                ['calories'] : calories
            })
            // console.log(exercises_details);
            exercises = Object.assign(exercises, {
                // ["Exercise" + j] : day[j]
                ["Exercise" + j] : exercises_details
            });
        }
        
        if (exercises == "{}") {
            exercises = "Rest day";
        }
        
        workoutPlan = Object.assign(workoutPlan, {
            ["Day" + (i)] : exercises
        });
    }

    console.log(workoutPlan);
    console.log("...workout plan successfully generated.");
    return(JSON.stringify(workoutPlan));
}
runAI(inputPrompt);
