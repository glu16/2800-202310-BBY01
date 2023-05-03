// code structure src: https://www.youtube.com/watch?v=4qNwoAAfnk4

// get api key from .env file
import { config } from "dotenv"
config()

// import openAIAPI
import { Configuration, OpenAIApi } from "openai"

// create "instance" of the ai model to use with API key
const openai = new OpenAIApi( new Configuration({
    apiKey: process.env.API_KEY
}))


// import file system module
import { readFileSync, writeFileSync, writeFile } from 'fs';

// open and read .csv files
// import { parse } from 'csv-parse';
const csv = readFileSync('../Datasets/Exercise/COMPILED_ACTIVITIES.csv', 'utf-8');


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

console.log("Prompt: " + inputPrompt);

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
    const paragraphs = fullResponse.split('\n\n'); //an array of paragraphs

    // print to console
    for (let i = 0; i < paragraphs.length; i++) {  
        console.log(paragraphs[i]);
    }

    // parse and save output as a JSON file
    var workoutPlan = {};
    for (let i = 0; i < paragraphs.length; i++) {  
        workoutPlan = Object.assign(workoutPlan, {
            ["Day" + (i + 1)] : paragraphs[i]
        });
    }

    writeFileSync('workoutPlan.json', JSON.stringify(workoutPlan));
    console.log("Output saved to workoutPlan.json.");

}
runAI(inputPrompt);
