import { NextFunction, Request, Response } from 'express'
import { ApiError, HttpCode } from '../erors/ApiError'
import { Movie } from '../models/movie.model'
import * as genreService from './../services/genre'
import * as movieService from './../services/movie'

interface Query {
  duration: string,
  genres: string
}

/**
 * Add new movie
 * @route POST /add
 */
export const add = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const movie = await movieService.add(req.body as Movie)
    res.status(HttpCode.CREATED).json(movie)
  }
  catch (e: any) {
    next(e)
  }
}

/**
 * Get movies
 * @route Get /
 */
export const get = async (req: Request<any, any, Query, any>, res: Response, next: NextFunction): Promise<Response | void> => {
  let { genres, duration } = req.query
  try {
    if (duration && isNaN(parseInt(duration))) // validate runtime
      throw new ApiError({ message: "Duration is not a number", status: HttpCode.BAD_REQUEST })
    const movies = await movieService.getFiltered(duration, genreService.clean(genres))

    res.status(HttpCode.OK).json(movies)
  }
  catch (e: any) {
    next(e)
  }
}