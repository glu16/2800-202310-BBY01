// make sure you add API_KEY to .env in server folder

// get api key from .env file
require('dotenv').config();

// import openAIAPI
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


// CREATE PROMPT FOR OPENAI TO HANDLE
function createPrompt() {

    // userStats from database
    // var age;
    // var sex;
    // var height;
    // var weight;
    // var activityLevel;
    // var goal;
    // var workoutRestrictions = [];
    // var workoutPreferences = [];


    // user input from fitness.jsx 
    var muscles = ['back', 'chest']; 
    var level = "intermediate"; 
    var environment = "indoor" // indoor, outdoor, either
    // var equipment = ['bike','gym'];


    // ADD USER DETAILS TO PROMPT
    var inputPrompt = "";
    // inputPrompt += `I am a ${age} ${sex} ${height} centimetres tall and weigh ${weight} kilograms. `
    // inputPrompt += `I am ${activityLevel}. My goal is to ${goal}. `
    inputPrompt += `Give me a ${level} level, 7-day workout routine with a focus on the following muscle groups: ` 
        + muscles.join(', ') + ". ";
    inputPrompt += "I only want " + environment + " activities. ";
    // inputPrompt += "\n In terms of equipment I am limited to " + equipment.join(', ');

    // ADD FORMATTING CONSTRAINTS TO PROMPT
    inputPrompt += "Give me at least five exercises for each day. "
    inputPrompt += "Give an estimated time required for each activity and a sum for all the activities each day. "
    inputPrompt += "Give an estimated number of calories burned. "
    inputPrompt += "Format each day with a number like Day 1 or Day 7. Do not use day names like Monday. "
    inputPrompt += "Format each exercise with the following structure: exercise name, number of sets and reps, estimated time to complete, and calories burned. "


    console.log("Prompt: \n" + inputPrompt);

    // RUNAI WITH PROMPT
    // runAI(inputPrompt);

    // RETURN inputPrompt
    return inputPrompt;
}

// RUN THE AI
async function runAI() {
    
    // start loading animation
    console.log("Generating workout plan...");
    startProgress();  

    // GET INPUTPROMPT
    var input = await createPrompt();

    // RUN OPEN AI ON PROMPT
    //default max tokens = 4096
    const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",  
    messages: [{ role: "user", content: input}]  
    })

    // stop loading animation
    stopProgress();  

    // RETURN PARSED AI RESPONSE
    return (parseAI(res));
}

// PARSE THE AI RESPONSE INTO A JSON OBJECT TO STORE IN USER DATABASE
function parseAI(res) {

    // fullResponse will store the string version of the AI response
    var fullResponse;
    try {
        fullResponse = res.data.choices[0].message.content;
        // console.log("fullResponse: " + fullResponse);
      } catch (error) {
        console.error("Error recieving fullResponse:", error);
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
            var jAdjusted = 0; // tracks j minus the ones skipped
            for (let j = 1; j < day.length; j++) {  //starting j=1 because 1st line is unwanted
                jAdjusted++;
                // skips empty spaces and last total conclusion paragraph
                if (day[j].length < 3 || day[j].includes("Total")) {
                    // console.log("Skipped j=" + j);
                    jAdjusted--;
                    continue;
                }

                // catch when exercise is empty
                
                var name;
                try {
                    // using conditional statements to check if not found (-1)
                    let marker = Math.min(
                    day[j].indexOf(",") == -1 ? day[j].length : day[j].indexOf(","), 
                    day[j].indexOf(" -") == -1 ? day[j].length : day[j].indexOf(" -"), 
                    day[j].indexOf(" –") == -1 ? day[j].length : day[j].indexOf(" –"), 
                    day[j].indexOf(":") == -1 ? day[j].length : day[j].indexOf(":") 
                    );
                    // console.log(marker);

                    // slices name out of the prompt using punctuation as marker
                    name = day[j].substring(day[j].indexOf(" ") + 1, marker);
                    // console.log("name: " + name);
                    
                    if (name == null) { throw new Error("name is null.")}; 
                  } catch (error) {
                    console.error("Error getting exercise name: ", error);
                    console.log("day[j]: " + JSON.stringify(day[j]));
                  }

                var setsAndReps;
                try {
                    // check that set and reps is in string
                    if (day[j].indexOf("sets") !== -1) {
                        setsAndReps = day[j].substring(day[j].indexOf("sets") - 2, day[j].indexOf("reps") + "reps".length);
                    // some are measured in minutes like planking
                    } else if (day[j].indexOf("minutes") !== -1) {
                        setsAndReps = day[j].substring(day[j].indexOf("min") - 3), day[j].indexOf("minutes") + "minutes".length;
                    } else {
                        setsAndReps = "n/a"
                    }
                    // console.log("setsAndReps: " + setsAndReps);
                    if (setsAndReps == null) { throw new Error("setsAndReps are null.")}; 
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
                    if (calories == null) { throw new Error("calories is null.")}; 
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
                        ["Exercise " + (jAdjusted)] : exercises_details
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
            
            // assign the day key as today's date + i
            const today = new Date();
            today.setDate(today.getDate() + i - 1);
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const date = today.toLocaleDateString('en-CA', dateOptions);
            try {
                workoutPlan = Object.assign(workoutPlan, {
                    [date] : exercises
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

    // RETURN WORKOUT PLAN TO SERVER
    return(JSON.stringify(workoutPlan));
}

// 'main' function that is called from promises from server.js 
function generate(callback) {
    runAI().then((result) => {
        const newWorkout = result;
        callback(newWorkout);
      });
}
// export function
module.exports = {
    generate: generate
  };
  
  
  
  
  
  
  