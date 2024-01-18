/* eslint-disable no-console */
import express from 'express'
import { printLog } from './print'

const port = 8080
const app = express()
app.use(express.json())

app.get('/ping', (req, res) => {
  res.status(200).json('okay')
})

app.post('/', (req, res) => {
  printLog(req.body)
  res.json()
})

export function startStream() {
  try {
    app.listen(port, () => {
      console.clear()
      console.log(`stream server is running on port ${port}`)
    })
  } catch (err) {
    if (err instanceof Error) {
      console.error(`${err.message}`)
    } else {
      console.error(err)
    }
  }
}
