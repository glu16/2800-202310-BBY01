import { openai } from '../Finetuning/0API.mjs'

// WHEN THIS FILE IS IN THE "Finetuning" FOLDER, YOU WILL GET AN AUTH ERROR, JUST DRAG OUT 0API.mjs
// AND THIS FILE INTO SERVER FOLDER AND RUN IT THERE

// THIS CODE IS FROM https://www.youtube.com/watch?v=Sb7U32kXMB0
// THE MODEL NAME IS FROM 3listFinetune.mjs
// THIS FILE COMPLETES THE TRAINING OF THE MODEL

//REPLACE 'model' WITH THE MODEL NAME FROM 3listFinetune.mjs
//REPLACE 'prompt' WITH THE QUESTION YOU WANT TO ASK

async function createCompletion() {
  try {
    const response = await openai.createCompletion({
      model: 'davinci:ft-personal-2023-05-15-05-32-16',
      prompt: `give me a fitness plan &&&&&`,
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