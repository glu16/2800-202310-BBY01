// code structure src: https://www.youtube.com/watch?v=4qNwoAAfnk4

// get api key from .env file
import { config } from "dotenv"
config()

// import openAIAPI
import { Configuration, OpenAIApi } from "openai"
// use nodejs library readline to get user input from console
import readline from "readline"

// create user interface
const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

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

// prompt user for input
userInterface.prompt()

// listener
userInterface.on("line", async input => {

    // console.log("loading...");

    // loading animation
    startProgress();  

    const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",  // change this
    messages: [{ role: "user", content: input}]  // input
    })

    // loading animation
    stopProgress();  

    // print out chatgpt response string
    const fullResponse = res.data.choices[0].message.content
    console.log(fullResponse);  

    
    // reprompt user for new input
    userInterface.prompt()
})

// create "instance" of the ai model to use with API key
const openai = new OpenAIApi( new Configuration({
    apiKey: process.env.API_KEY
}))

