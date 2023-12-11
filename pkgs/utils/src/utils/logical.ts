
export const compareTuples = <T>(valueTuple: [T, T], compareTuple: [T, T]): boolean => {
  if (valueTuple[0] === compareTuple[0] && valueTuple[1] === compareTuple[1]) return true
  if (valueTuple[0] === compareTuple[1] && valueTuple[1] === compareTuple[0]) return true
  return false
}

export function negateIf(condition: boolean, value: boolean) {
  if (condition) {
    return !value
  }
  return value
}
