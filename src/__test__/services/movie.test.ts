import { DURATION_THRESHOLD } from '../../config'
import { Genre } from '../../models/genre.model'
import { movieAccept } from '../utils/test.data'
import * as movieService from './../../services/movie'

describe("Movie service", () => {
  describe("Add function", () => {
    let movieCountBefore: number
    beforeAll(async () => {
      movieCountBefore = (await movieService.getMovies()).length
    })
    test("should add movie to a file", async () => {
      await movieService.add(movieAccept)
      const movies = await movieService.getMovies()
      expect(movies.length).toEqual(movieCountBefore + 1)
    })
    test("should return movie with id", async () => {
      const movie = await movieService.add(movieAccept)
      expect(movie).toHaveProperty("id")
    })

    //TODO: delete two after
  })
  describe("Get one random function", () => {
    test("should return one movie", async () => {
      const movie = await movieService.getOneRandom()
      expect(movie).toHaveProperty('id')
    })
  })

  describe("Get movies function", () => {
    test("should return an array", async () => {
      const movies = await movieService.getMovies()
      expect(movies).toBeInstanceOf(Array)
      expect(movies[0]).toHaveProperty("runtime")
    })
  })

  describe("Get many by runtime function", () => {
    test("should return an array", async () => {
      const movies = await movieService.getManyByRuntime(100, DURATION_THRESHOLD)
      expect(movies).toBeInstanceOf(Array)
      expect(movies[0]).toHaveProperty("runtime")
    })
  })

  describe("Get filtered function", () => {

    const duration = 100
    const genres: Array<Genre> = ["Comedy", "Fantasy", "Crime"]

    test("If we don't provide any parameter, then it should return a single random movie.", async () => {
      const movies = await movieService.getFiltered()
      expect(movies).toHaveLength(1)
    })

    test("If we provide only duration parameter, then it should return a single random movie that has a runtime between <duration - 10> and <duration + 10>.", async () => {
      const movies = await movieService.getFiltered(duration.toString())
      expect(movies).toHaveLength(1)
      const runtime = parseInt(movies[0].runtime)
      expect(runtime).toBeGreaterThanOrEqual(duration - 10)
      expect(runtime).toBeLessThanOrEqual(duration + 10)
    })

    test("If we provide only genres parameter, then it should return all movies that contain at least one of the specified genres", async () => {
      const movies = await movieService.getFiltered(undefined, genres)
      for (const movie of movies) {
        const shouldPass = movie.genres.includes(genres[0]) || movie.genres.includes(genres[1]) || movie.genres.includes(genres[2])
        expect(shouldPass).toBe(true)
      }
    })

    test("If we provide only genres parameter, then it shouldn't return any movie that contain at least one of the remaining genres", async () => {
      const movies = await movieService.getFiltered(undefined, genres)
      for (const movie of movies) {
        for (const genre of movie.genres) {
          const shouldPass = (genre === genres[0] || genre === genres[1] || genre === genres[2])
          expect(shouldPass).toBe(true)
        }
      }
    })

    test("If we provide only genres parameter, then movies should be ordered by a number of genres that match", async () => {
      const movies = await movieService.getFiltered(undefined, genres)
      const shouldPass = movies.every(function (x, i) {
        return i === 0 || x.genres <= movies[i - 1].genres
      })
      expect(shouldPass).toBe(true)
    })

    test("If we provide both, genres and duration parameter, then returned movies should have a runtime between <duration - 10> and <duration + 10>", async () => {
      const movies = await movieService.getFiltered(duration.toString(), genres)
      for (const movie of movies) {
        const runtime = parseInt(movie.runtime)
        expect(runtime).toBeGreaterThanOrEqual(duration - 10)
        expect(runtime).toBeLessThanOrEqual(duration + 10)
      }
    })

    test("If we provide both, genres and duration parameter, then it should return all movies that contain at least one of the specified genres", async () => {
      const movies = await movieService.getFiltered(undefined, genres)
      for (const movie of movies) {
        const shouldPass = movie.genres.includes(genres[0]) || movie.genres.includes(genres[1]) || movie.genres.includes(genres[2])
        expect(shouldPass).toBe(true)
      }
    })

    test("If we provide both, genres and duration parameter, then it shouldn't return any movie that contain at least one of the remaining genres", async () => {
      const movies = await movieService.getFiltered(undefined, genres)
      for (const movie of movies) {
        for (const genre of movie.genres) {
          const shouldPass = (genre === genres[0] || genre === genres[1] || genre === genres[2])
          expect(shouldPass).toBe(true)
        }
      }
    })

    test("If we provide both, genres and duration parameter, then movies should be orderd by a number of genres that match", async () => {
      const movies = await movieService.getFiltered(undefined, genres)
      const shouldPass = movies.every(function (x, i) {
        return i === 0 || x.genres <= movies[i - 1].genres
      })
      expect(shouldPass).toBe(true)
    })
  })
})
