import { openai } from './0API.mjs'
import fs from 'fs'


// THIS CODE IS FROM https://www.youtube.com/watch?v=Sb7U32kXMB0
// THE FILE CREATES A FILE ID AND SAVES IT TO A FILE CALLED fileId.js
// THIS FILE IS USED IN 2createFinetune.mjs

async function upload() {
  try {
    const response = await openai.createFile(
      fs.createReadStream('./trainData_prepared.jsonl'),
      'fine-tune'
    );
    console.log('File ID: ', response.data.id)
    fs.writeFileSync('./fileId.js', `export const fileId = "${response.data.id}"`)
  } catch (err) {
    console.log('err: ', err)
  }
}

upload()