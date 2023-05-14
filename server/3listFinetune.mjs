import { openai } from './0API.mjs'

// THIS CODE IS FROM https://www.youtube.com/watch?v=Sb7U32kXMB0
// THIS FILES TELLS YOU THE STATUS OF THE FINE TUNE IS COMPLETED
// AND GIVE YOU THE FINETUNE ID WHICH IS USED IN 4finetuneCompletion.mjs

async function listFineTunes() {
  try {
    const response = await openai.listFineTunes()
    console.log('data: ', response.data.data)
  } catch (err) {
    console.log('error:', err)
  }
}

listFineTunes()