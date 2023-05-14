import { Configuration, OpenAIApi } from 'openai'
import dotenv from "dotenv";
dotenv.config();



const configuration = new Configuration({
    organization: process.env.ORG,
    apiKey: process.env.AI,
  });
 export const openai = new OpenAIApi(configuration);
 