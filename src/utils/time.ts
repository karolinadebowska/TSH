/**
 * @param  {number} ms
 * @returns Promise
 */
export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}