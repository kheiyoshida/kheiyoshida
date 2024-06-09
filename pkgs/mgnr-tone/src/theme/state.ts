import { Middlewares, createGenerator } from 'mgnr-core'
import * as Transport from '../tone-wrapper/Transport'
import { ToneOutlet } from '../Outlet'
import { ToneOutletPort } from '../OutletPort'
import { GeneratorSpec, Scene, SceneComponent, SceneComponentPosition } from './scene'

type ActiveComponentState = {
  ports: ToneOutletPort<Middlewares>[]
  component: SceneComponent
}

export const createMusicState = (outlets: Record<string, ToneOutlet>) => {
  const active: Record<SceneComponentPosition, ActiveComponentState | null> = {
    top: null,
    bottom: null,
    right: null,
    left: null,
    center: null,
  }

  const applyScene = (scene: Scene, nextStart = Transport.toSeconds('@4m')) => {
    const keys: SceneComponentPosition[] = ['top', 'bottom', 'right', 'left', 'center']
    keys.forEach((p) => {
      const component = scene[p]
      if (component) applyComponent(p, component, nextStart)
    })
  }

  const applyComponent = (
    position: SceneComponentPosition,
    component: SceneComponent,
    nextStart: number
  ) => {
    const currentComponent = active[position]
    if (currentComponent) {
      currentComponent.ports.forEach((p) => p.stopLoop())
    }
    const newPorts: ToneOutletPort<Middlewares>[] = currentComponent ? currentComponent.ports : []
    component.generators.forEach((spec, i) => {
      const port = currentComponent?.ports[i]
      if (port) {
        overridePort(port, spec)
      } else {
        const outlet = outlets[component.outId]
        if (!outlet) throw Error(`outlet ${component.outId} not found`)
        newPorts.push(createNewPortForOutlet(outlets[component.outId], spec, nextStart))
      }
    })
    active[position] = {
      ports: newPorts,
      component,
    }
  }

  return {
    get active() {
      return active
    },
    applyScene,
  }
}

export const overridePort = (port: ToneOutletPort<Middlewares>, spec: GeneratorSpec) => {
  port.onElapsed((g) => {
    g.updateConfig(spec.generator)
    g.resetNotes(spec.notes)
    port.numOfLoops = spec.loops
    port.onElapsed(spec.onElapsed)
    port.onEnded(spec.onEnded)
  })
}

export const createNewPortForOutlet = (
  outlet: ToneOutlet,
  spec: GeneratorSpec,
  start: number
): ToneOutletPort<Middlewares> => {
  const newGenerator = createGenerator({
    ...spec.generator,
    notes: spec.notes,
    middlewares: spec.middlewares,
  })
  return outlet
    .assignGenerator(newGenerator)
    .loopSequence(spec.loops, start)
    .onElapsed(spec.onElapsed)
    .onEnded(spec.onEnded)
}
