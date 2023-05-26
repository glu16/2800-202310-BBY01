require("dotenv").config();

const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.API_KEY,
  })
);

function createPrompt(
  sex,
  age,
  height,
  weight,
  activityLevel,
  goal,
  foodPref,
  foodRes
) {
  var inputPrompt = `I am a ${age} year old ${sex} and I am ${height} m tall and weigh ${weight} kilograms.
My activity level is ${activityLevel} and my goal is to ${goal}. `;
  inputPrompt += `My restrictions are ${foodRes} and my preferences are ${foodPref}.`;
  inputPrompt += "Give me a 7-day diet plan. ";
  inputPrompt += "Give me at least five meal options for each day. ";
  inputPrompt +=
    "Format each day with a number like Day 1 or Day 7. Do not use day names like Monday. ";
  inputPrompt +=
    "Format each meal option like this example sentance: Meal 1: Broccoli and chicken fajitas (Protein: 25g, Carbs: 20g, Fat: 8g) Calories: 270";

  console.log("Prompt: \n" + inputPrompt);

  return inputPrompt;
}

async function runAI(
  sex,
  age,
  height,
  weight,
  activityLevel,
  goal,
  foodPref,
  foodRes
) {
  console.log("Generating diet plan...");

  // GET INPUTPROMPT
  var input = await createPrompt(
    sex,
    age,
    height,
    weight,
    activityLevel,
    goal,
    foodPref,
    foodRes
  );

  // RUN OPEN AI ON PROMPT
  const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: input }],
    temperature: 0.2,
  });

  // RETURN PARSED AI RESPONSE
  return parseAI(res);
}

function parseAI(res) {
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
      const pstOptions = { timeZone: "America/Los_Angeles" };
      const pstToday = new Date(today.toLocaleString("en-US", pstOptions));
      pstToday.setDate(today.getDate() + i - 1);
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
}
function generate(
  sex,
  age,
  height,
  weight,
  activityLevel,
  goal,
  foodPref,
  foodRes,
  callback
) {
  runAI(sex, age, height, weight, activityLevel, goal, foodPref, foodRes).then(
    (result) => {
      const newDiet = result;
      callback(newDiet);
    }
  );
}
module.exports = {
  generate: generate,
};
