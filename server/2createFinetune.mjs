import { openai } from './0API.mjs'
import { fileId } from './00fileId.mjs'

// THIS CODE IS FROM https://www.youtube.com/watch?v=Sb7U32kXMB0
// THIS FILE FINETUNES THE MODEL

async function createFineTune() {
  try {
    const response = await openai.createFineTune({
      training_file: fileId,
      model: 'davinci'
    })
    console.log('response: ', response)
  } catch (err) {
    console.log('error: ', err.response.data.error)
  }
}

createFineTune()