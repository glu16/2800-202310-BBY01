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

// prompt user for input
userInterface.prompt()

// listener
userInterface.on("line", async input => {
    const res = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",  // change this
    messages: [{ role: "user", content: input}]  // input
})
    // print out chatgpt response string
    console.log(res.data.choices[0].message.content);  
    // reprompt user for new input
    userInterface.prompt()
})

// create "instance" of the ai model to use with API key
const openai = new OpenAIApi( new Configuration({
    apiKey: process.env.API_KEY
}))

