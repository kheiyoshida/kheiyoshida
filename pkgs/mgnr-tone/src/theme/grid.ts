import { ThemeMaker } from "./theme"

export type ThemeGrid = ReturnType<typeof createThemeGrid>
export type ThemeGridRow = 'top' | 'center' | 'bottom'
export type ThemeGridColumn = 'left' | 'center' | 'right'
export type ThemeGridPosition = `${ThemeGridRow}-${ThemeGridColumn}`
export type ThemeGridDirection = 'up' | 'down' | 'left' | 'right'

export const createThemeGrid = (themeMakers: {[position in ThemeGridPosition]: ThemeMaker}) => {
  let lastPosition: ThemeGridPosition = 'center-center'
  let currentPosition: ThemeGridPosition = 'center-center'
  return {
    updatePosition: (next: ThemeGridPosition) => {
      currentPosition = next
    },
    getInitialTheme: () => {
      return themeMakers[lastPosition]
    },
    getNextTheme: () => {
      if (lastPosition === currentPosition) return
      lastPosition = currentPosition
      return themeMakers[currentPosition]
    },
  }
}
