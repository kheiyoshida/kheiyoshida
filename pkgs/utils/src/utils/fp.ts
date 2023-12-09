export const once =
  <T, A extends any[]>(calc: (...args: A) => T) =>
  (...args: A) => {
    let result
    if (result === undefined) {
      result = calc(...args)
    }
    return result
  }

export const wrapLogger =
  <T>(fn: (...args: any) => T) =>
  (...args: any) => {
    const returned = fn(args)
    console.log(returned)
    return returned
  }
