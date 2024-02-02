import * as genreService from './../../services/genre'

describe("Genre service", () => {
  describe("Clean function", () => {
    const genres = "comedy,Adventure,Romantic"
    test("should return an arrays", () => {
      expect(genreService.clean(genres)).toBeInstanceOf(Array)
    })
    test("should get rid of incorrect genres", () => {
      expect(genreService.clean(genres)).toHaveLength(2);
    })
    test("should correct casing of string to provided in schema", () => {
      expect(genreService.clean(genres)).toEqual(["Comedy", "Adventure"])
    })
  })
})