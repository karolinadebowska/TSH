import * as fs from 'fs'
import { promises as fsp } from 'fs'
import * as lockfile from 'proper-lockfile'
import { DURATION_THRESHOLD } from '../config'
import { ApiError, HttpCode } from '../erors/ApiError'
import { Movie, MovieDocument } from "../models/movie.model"
import { randomInt } from '../utils/math'
import { sleep } from '../utils/time'

const PATH = 'db.json' // path to the db

/**
 * Adds movie to a file with implemented locking mechanism 
 * so that content of file doesn't change while file is read and id is created
 * @param {Movie} movie
 * @returns Promise
 */
export const add = async (movie: Movie): Promise<MovieDocument | undefined> => {
  let doc: MovieDocument
  for (let i = 0; i < 15; i++) {   // attempt to do this 15 times
    if (fs.existsSync(PATH)) {
      const checkFile = await lockfile.check(PATH)
      if (checkFile)
        await sleep(1000)
      else { // file is not locked
        await lockfile.lock(PATH)
        doc = await createMovie(movie)
        await lockfile.unlock(PATH)  // release lock
        return doc
      }
    }
    else
      throw new ApiError({ message: `File with path ${PATH} doesn't exist`, status: HttpCode.INTERNAL_SERVER_ERROR })
  }
}

/**
 * Assign an id and add movie to a file
 * @param {Movie} movie
 * @returns Promise
 */
const createMovie = async (movie: Movie): Promise<MovieDocument> => {
  const { genres, movies } = await getData()
  const doc = { id: movies[movies.length - 1].id + 1, ...movie } as MovieDocument
  movies.push(doc)
  await fsp.writeFile(PATH, JSON.stringify({ genres, movies }, null, 4))
  return doc
}

/**
 * Get an array of movies by specified array of genre
 * Optional movie param provided to make use of multiple filters
 * @param  {Array<string>} genres
 * @param  {Array<MovieDocument>} movies?
 * @returns Promise
 */
const getManyByGenre = async (genres: Array<string>, movies?: Array<MovieDocument>): Promise<Array<MovieDocument>> => {
  if (!movies)
    movies = await getMovies()
  return (movies.filter((el) => el.genres.every(val => genres.includes(val))).sort((a, b) => b.genres.length - a.genres.length))
}

/**
 * Get one random movie
 * @returns Promise
 */
export const getOneRandom = async (): Promise<MovieDocument> => {
  const movies = await getMovies()
  return movies[randomInt(0, movies.length - 1)]
}

/**
 * Get array of all movies saved in a file
 * @returns Promise
 */
export const getMovies = async (): Promise<Array<MovieDocument>> => {
  return (await getData()).movies
}

/**
 * Get array of movies with runtime in a range <runtime-THRESHOLD, runtime+THRESHOLD>
 * @param {number} runtime
 * @param {number} threshold
 */
export const getManyByRuntime = async (runtime: number, threshold: number) => {
  const movies = await getMovies()
  return movies.filter((el) => el.runtime >= runtime - threshold && el.runtime <= runtime + threshold)
}

/**
 * Get an array of movies basen on conditions
 * @param  {string} runtime?
 * @param  {Array<string>=[]} genres
 * @returns Promise<Array<MovieDocument>>
 */
export const getFiltered = async (runtime?: string, genres: Array<string> = []): Promise<Array<MovieDocument>> => {
  let filtered
  if (runtime) {
    filtered = await getManyByRuntime(parseInt(runtime), DURATION_THRESHOLD)
    if (!genres || genres.length === 0)
      return filtered.length > 0 ? [filtered[randomInt(0, filtered.length - 1)]] : []
  }
  if (genres && genres.length > 0)
    filtered = await getManyByGenre(genres, filtered)
  if (filtered) return filtered

  return [await getOneRandom()] // default case
}

/**
 * Read and return the content of file
 * @returns 
 */
const getData = async () => {
  try {
    return JSON.parse(await fsp.readFile(PATH, 'utf8'))
  }
  catch (e: any) {
    throw new ApiError({ message: "Exception while reading a file", status: e.status || HttpCode.INTERNAL_SERVER_ERROR })
  }
}