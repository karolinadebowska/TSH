import { Genre, genre } from "../models/genre.model"

/**
 * This preprocess a genre passed in query - removes duplicates, gets rid of incorrect genres and change its type to array
 * @param {string} genres
 */
export const clean = (genres?: string): Array<Genre> => {
  if (!genres || genres.length === 0)
    return []
  return Array.from(new Set(genres.split(',').map((el: string) => imposeType(el)).filter((el) => genre.includes(el))))
}

/**
 * Impose casing rule derived from schema
 * @param {string} str
 */
const imposeType = (str: string): Genre => {
  return str.split('-').map((el) => el[0].toUpperCase() + el.substring(1).toLowerCase()).join('-') as Genre;
}
