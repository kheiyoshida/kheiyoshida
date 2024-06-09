import * as Tone from 'tone'
import { createOutlet } from '../commands'
import { GeneratorSpec, SceneComponent } from './scene'
import { createMusicState } from './state'
import * as stateModule from './state'

jest.mock('tone')

const FIXED_SECONDS_PER_MEASURE = 1
jest.mock('../tone-wrapper/Transport', () => ({
  ...jest.createMockFromModule<typeof import('../tone-wrapper/Transport')>(
    '../tone-wrapper/Transport'
  ),
  toSeconds: () => FIXED_SECONDS_PER_MEASURE,
}))

const createMusicOutlets = () => ({
  synth: createOutlet(new Tone.Synth()),
  tom: createOutlet(new Tone.MembraneSynth()),
})

describe(`${createMusicState.name}`, () => {
  const generatorSpec = (override?: Partial<GeneratorSpec>) =>
    ({
      generator: {},
      loops: 4,
      onElapsed: () => undefined,
      onEnded: () => undefined,
      ...override,
    }) as GeneratorSpec
  it(`can apply scene component`, () => {
    const outlets = createMusicOutlets()
    const state = createMusicState(outlets)

    const component: SceneComponent = {
      outId: 'synth',
      generators: [generatorSpec()],
    }
    state.applyScene(
      {
        top: component,
      },
      0
    )
    expect(state.active.top).not.toBeNull()
    expect(state.active.top?.ports).toHaveLength(1)
  })
  it(`should override port when there's already an active ones`, () => {
    const outlets = createMusicOutlets()
    const state = createMusicState(outlets)
    const spyOverride = jest.spyOn(stateModule, 'overridePort')

    // 1
    state.applyScene(
      {
        top: { outId: 'synth', generators: [generatorSpec(), generatorSpec()] },
      },
      0
    )
    // 2nd
    const newSpec = generatorSpec({ loops: 2 })
    state.applyScene(
      {
        top: {
          outId: 'synth',
          generators: [newSpec],
        },
      },
      0
    )
    
    expect(state.active.top).not.toBeNull()
    expect(state.active.top?.ports).toHaveLength(2)
    expect(state.active.top?.ports[0].numOfLoops).toBe(0) // -> becomes 2 on next onElapsed
    expect(spyOverride).toHaveBeenCalledWith(state.active.top?.ports[0], newSpec)
    expect(state.active.top?.ports[1].numOfLoops).toBe(0) // stops
  })
})
