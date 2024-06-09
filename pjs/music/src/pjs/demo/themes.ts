import { SceneMaker, createSceneGrid } from 'mgnr-tone'

export type Character = 'dark' | 'neutral' | 'bright'

const devScene: SceneMaker = (source, alignment) => ({
  top: {
    outId: 'synth',
    generators: [
      {
        generator: {
          scale: source.createScale(),
          note: {
            duration: 1,
          },
        },
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        onEnded: (g) => g.resetNotes(),
      },
    ],
  },
})

const devScene2: SceneMaker = (source, alignment) => ({
  top: {
    outId: 'synth',
    generators: [
      {
        generator: {
          scale: source.createScale(),
          note: {
            duration: 4,
          },
        },
        loops: 4,
        onElapsed: (g) => g.mutate({ rate: 0.2, strategy: 'inPlace' }),
        onEnded: (g) => g.resetNotes(),
      },
    ],
  },
})

export const themeGrid = createSceneGrid({
  // top
  'left-top': devScene,
  'center-top': devScene2,
  'right-top': devScene,

  // middle
  'left-middle': devScene,
  'center-middle': devScene,
  'right-middle': devScene,

  // bottom
  'left-bottom': devScene,
  'center-bottom': devScene,
  'right-bottom': devScene,
})
