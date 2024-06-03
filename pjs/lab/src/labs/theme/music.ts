import { Theme, prepareDrums, prepareSynth } from './themes'

export const createMusic = (themeGrid: ReturnType<typeof createThemeGrid>) => {
  let currentTheme: Theme
  return {
    applyNextTheme() {
      if (!currentTheme) {
        currentTheme = themeGrid.getInitialTheme()()
        return
      }
      const nextTheme = themeGrid.getNextTheme()
      if (!nextTheme) return
      currentTheme.fadeOut()
      currentTheme = nextTheme()
    },
  }
}

export type Alignment = -1 | 0 | 1

export const createThemeGrid = () => {
  let lastAlignment: Alignment = 0
  let currentAlignment: Alignment = 0
  const themes: Record<Alignment, () => Theme> = {
    [-1]: prepareSynth,
    [0]: prepareDrums,
    1: prepareSynth,
  }
  return {
    get currentAlignment() {
      return currentAlignment
    },
    updateAlignment: (nextAlignment: Alignment) => {
      currentAlignment = nextAlignment
    },
    getInitialTheme: () => {
      return themes[0]
    },
    getNextTheme: () => {
      if (lastAlignment === currentAlignment) return
      lastAlignment = currentAlignment
      return themes[currentAlignment]
    },
  }
}
