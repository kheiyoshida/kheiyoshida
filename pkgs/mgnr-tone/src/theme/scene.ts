import { GeneratorConf, Middlewares, SequenceGenerator, SequenceNoteMap } from 'mgnr-core'

/**
 * A collection of generator specifications
 * where each component is positioned
 */
export type Scene<AvailableOutlets = string> = {
  [k in SceneComponentPosition]?: SceneComponent<AvailableOutlets>
}

export type SceneComponentPosition = 'top' | 'bottom' | 'right' | 'left' | 'center'

export type SceneComponent<AvailableOutlets = string> = {
  outId: AvailableOutlets
  generators: GeneratorSpec[]
}

export type GeneratorSpec<MW extends Middlewares = Middlewares> = {
  generator: GeneratorConf
  notes?: SequenceNoteMap
  middlewares?: MW
  loops: number
  onElapsed: (g: SequenceGenerator<MW>) => void
  onEnded: (g: SequenceGenerator<MW>) => void
}
