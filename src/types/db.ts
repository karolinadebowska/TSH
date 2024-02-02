import { Genre } from "../models/genre.model"
import { MovieDocument } from "../models/movie.model"

export interface Db {
  genres: Array<Genre>, movies: Array<MovieDocument>
}