import { openai } from './0API.mjs'

// THIS CODE IS FROM https://www.youtube.com/watch?v=Sb7U32kXMB0
// THE MODEL NAME IS FROM 3listFinetune.mjs
// THIS FILE COMPLETES THE TRAINING OF THE MODEL

async function createCompletion() {
  try {
    const response = await openai.createCompletion({
      model: 'davinci:ft-personal-2023-05-14-08-33-54',
      prompt: `What are some tips for meal planning?`,
      max_tokens: 1000,
      stop: ['\n']
    })
    if (response.data) {
      console.log('choices: ', response.data.choices)
    }
  } catch (err) {
    console.log('err: ', err)
  }
}

createCompletion()