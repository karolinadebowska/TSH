/**
 * Generate a random number in a specified range (min and max included)
 * @param {number} min
 * @param {number} max
 * @returns {number} random
 */
export const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
