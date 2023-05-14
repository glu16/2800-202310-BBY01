import { openai } from './0API.mjs'

// THIS CODE IS FROM https://www.youtube.com/watch?v=Sb7U32kXMB0
// THE MODEL NAME IS FROM 3listFinetune.mjs
// THIS FILE COMPLETES THE TRAINING OF THE MODEL

//REPLACE 'model' WITH THE MODEL NAME FROM 3listFinetune.mjs
//REPLACE 'prompt' WITH THE QUESTION YOU WANT TO ASK

async function createCompletion() {
  try {
    const response = await openai.createCompletion({
      model: 'davinci:ft-personal-2023-05-14-21-14-45',
      prompt: `How long should you hold a stretch during a cool-down session? &&&&&`,
      max_tokens: 200,
      stop: ['#####']
    })
    if (response.data) {
      console.log('choices: ', response.data.choices)
    }
  } catch (err) {
    console.log('err: ', err)
  }
}

createCompletion()

//node 4createCompletion.mjs