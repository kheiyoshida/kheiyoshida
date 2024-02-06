export const registerKeys = (keyCodes: number[]) => (): number[] => {
  return keyCodes.filter((keyCode) => p.keyIsDown(keyCode))
}
