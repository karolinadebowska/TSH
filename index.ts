import dotenv from "dotenv"
import express, { Express, NextFunction, Request, Response } from "express"
import { HttpCode } from "./src/erors/ApiError"
import { errorHandler } from "./src/erors/ErrorHandler"
import routes from './src/routes'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'origin,X-Requested-With,Content-Type,Accept,Authorization'
  )

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST')
    return res.status(HttpCode.OK).json({})
  }
  next()
})

app.use(routes)

app.use((_, res) => {
  const error = new Error('Not found')
  return res.status(HttpCode.NOT_FOUND).json({
    message: error.message,
  })
})

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  //console.error(error)
  errorHandler.handleError(error, res)
})

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
export default app