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
const inputPrompt = "Give me a 7-day workout routine with a focus on the following muscle groups:" + muscles.join(', ') + ".";

// run the AI
const runAI = async (input) => {
    
    // loading animation
    console.log("loading...");
    startProgress();  

    const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",  // change this
    messages: [{ role: "user", content: input}]  // input
    })

    // loading animation
    stopProgress();  

    // print out chatgpt response string
    const fullResponse = res.data.choices[0].message.content
    const paragraphs = fullResponse.split('\n\n');
    for (let i = 0; i < paragraphs.length - 1; i++) {  //-1 to paragraph.length to omit last useless paragraph
        let paragraph = paragraphs[i];
        // console.log(`Paragraph ${i + 1}:`);
        console.log(paragraph);
    }
}
runAI(inputPrompt);
