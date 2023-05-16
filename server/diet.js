require("dotenv").config();

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  localStorage = new LocalStorage("./scratch");
}

// This page is bascially the same as workout.js, but it is for diet plans instead of workout plans.

const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

// create progress wheel animation, code src: chatgpt
const PWD = ["|", "/", "-", "\\"];
let idx = 0;
let progressInterval;
const startProgress = () => {
  progressInterval = setInterval(() => {
    process.stdout.write("\r" + PWD[idx++ % PWD.length]);
  }, 100);
};
const stopProgress = () => {
  clearInterval(progressInterval);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
};

/* 
You normally cant get localStoreage to the backend but we can with node-localstorage
*/
const email = localStorage.getItem("email");

async function getUserStats() {
  var response = await fetch(`http://localhost:5050/userStats/${email}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  var data = await response.json();
  return data;
}

// This wrapper function, "generate(callback)", is needed to use the data within the .then() menthod.
function generate(callback) {
  getUserStats().then((data) => {
    console.log(data);

    var sex = data.sex;
    var age = data.age;
    var height = data.height;
    var weight = data.weight;
    var activityLevel = data.activityLevel;
    var goal = data.goal;

    var foodRestrictions = [];
    var foodPreferences = [];

    if (foodRestrictions.length == 0) {
      foodRestrictions = ["none"];
    }
    if (foodPreferences.length == 0) {
      foodPreferences = ["none"];
    }

    let inputPrompt = `I am a ${age} ${sex} and I am ${height} m tall and weigh ${weight} kilograms. My activity level is ${activityLevel} and my goal is to ${goal}. My restrictions are ${foodRestrictions.join(
      ", "
    )} and my preferences are ${foodPreferences.join(", ")}. `;

    inputPrompt += "Give me a 7-day diet plan. ";
    inputPrompt += "Give me at least five meal options for each day. ";
    inputPrompt +=
      "Format each day with a number like Day 1 or Day 7. Do not use day names like Monday. ";
    inputPrompt +=
      "Format each meal option like this example sentance: Meal 1: Broccoli and chicken fajitas (Protein: 25g, Carbs: 20g, Fat: 8g) Calories: 270";

    console.log(inputPrompt);

    runAI(inputPrompt).then((result) => {
      const newDietPlan = result;
      callback(newDietPlan);
    });
  });
}
const runAI = async (input) => {
  console.log("Generating diet plan...");
  startProgress();
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
  });
  stopProgress();
  var fullResponse;
  try {
    fullResponse = res.data.choices[0].message.content;
    // console.log("fullResponse: " + fullResponse);
  } catch (error) {
    console.error("Error generating fullResponse:", error);
  }
  var paragraphs;
  try {
    paragraphs = fullResponse.split("Day ");
  } catch (error) {
    console.error("Error splitting fullResponse into paragraphs:", error);
  }
  var dietPlan = {};
  try {
    for (let i = 1; i < paragraphs.length; i++) {
      var day = paragraphs[i].split("\n");
      var meals = {};
      var jAdjusted = 0;
      for (let j = 1; j < day.length; j++) {
        jAdjusted++;
        if (day[j].length < 3 || day[j].includes("Total")) {
          jAdjusted--;
          continue;
        }
        var name;
        try {
          // chatGPT source for regex:
          name = (day[j].match(/\d+: (.*?)(?=\s\()/) || [])[1];
          if (name == null) {
            throw new Error("name is null.");
          }
        } catch (error) {
          console.error("Error getting Food name: ", error);
          console.log("day[j]: " + JSON.stringify(day[j]));
        }

        var nutritionalInfo;
        try {
          // chatGPT source for regex:
          nutritionalInfo = (day[j].match(/\((.*?)\)/) || [])[1];
          if (nutritionalInfo == null) {
            throw new Error("nutritionalInfo is null.");
          }
        } catch (error) {
          console.error("Error getting nutritional information: ", error);
          console.log("day[j]: " + JSON.stringify(day[j]));
        }

        var calories = 0;
        try {
          const matches = day[j].match(/\d+/g);
          for (let i = 0; i < matches.length; i++) {
            const num = parseInt(matches[i]);
            if (num > calories) {
              calories = num;
            }
          }
          if (calories == null) {
            throw new Error("calories is null.");
          }
        } catch (error) {
          console.error("Error getting exercise calories: ", error);
          console.log("day[j]: " + JSON.stringify(day[j]));
        }
        if (name == null || calories == null) {
          console.log("Invalid exercise tossed: " + day[j]);
          continue;
        }
        var mealDetails = {};
        try {
          mealDetails = Object.assign(mealDetails, {
            ["Name"]: name,
            ["Nutritional Info"]: nutritionalInfo,
            ["Calories"]: calories,
          });
          meals = Object.assign(meals, {
            ["Meal " + jAdjusted]: mealDetails,
          });
        } catch (error) {
          console.error("Error assigning meals details to meal object:", error);
        }
      }
      if (meals == "{}") {
        meals = "Rest day";
      }
      const today = new Date();
      today.setDate(today.getDate() + i - 1);
      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const date = today.toLocaleDateString("en-CA", dateOptions);
      try {
        dietPlan = Object.assign(dietPlan, {
          [date]: meals,
        });
      } catch (error) {
        console.error("Error assigning meals to dietPlan object:", error);
      }
    }
  } catch (error) {
    console.error("Error parsing paragraphs into diet plan:", error);
  }

  console.log(dietPlan);
  console.log("...diet plan generated.");
  return JSON.stringify(dietPlan);
};

module.exports = {
  generate: generate,
};
