import { Router } from 'express'
import * as movieController from "../controllers/movieController"
import jsonValidator from '../middleware/json-validator'
import { MovieSchema } from '../models/movie.model'

const moviesRouter = Router()

moviesRouter.get('/', movieController.get)

moviesRouter.post('/add', jsonValidator({ body: MovieSchema }), movieController.add)

export default moviesRouter