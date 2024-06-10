import { Middlewares, createGenerator } from 'mgnr-core'
import * as Transport from '../tone-wrapper/Transport'
import { ToneOutlet } from '../Outlet'
import { ToneOutletPort } from '../OutletPort'
import { GeneratorSpec, Scene, SceneComponent, SceneComponentPosition } from './scene'
import { InOut } from './fade'

export type ActiveComponents = Record<SceneComponentPosition, ActiveComponentState | null>
type ActiveComponentState = {
  ports: ToneOutletPort<Middlewares>[]
  component: SceneComponent
}

export const createMusicState = (outlets: Record<string, ToneOutlet>) => {
  const active: ActiveComponents = {
    top: null,
    bottom: null,
    right: null,
    left: null,
    center: null,
  }

  const applyScene = (scene: Scene, nextStart = Transport.toSeconds('@4m')): InOut => {
    const inOut = checkDiff(active, scene)
    const positions: SceneComponentPosition[] = ['top', 'bottom', 'right', 'left', 'center']
    positions.forEach((position) => {
      const activeCp = active[position]
      const sceneComponent = scene[position]
      if (sceneComponent) {
        applyComponent(position, sceneComponent, nextStart)
      } else {
        if (activeCp) {
          activeCp.ports.forEach(cancelPort)
          active[position] = null
        }
      }
    })
    return inOut
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
        newPorts.push(createNewPortForOutlet(outlet, spec, nextStart))
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

export const cancelPort = (port: ToneOutletPort<Middlewares>) => {
  port.stopLoop()
  // Transport.scheduleOnce(() => {
  // }, '8m')
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

export const checkDiff = (activeComponents: ActiveComponents, nextScene: Scene): InOut => {
  const inOut: InOut = { in: {}, out: {} }
  Object.keys(activeComponents).forEach((p) => {
    const position = p as SceneComponentPosition
    const activeComponent = activeComponents[position]
    const sceneComponent = nextScene[position]
    if (activeComponent && sceneComponent) {
      if (activeComponent.component.outId !== sceneComponent.outId) {
        inOut.in[position] = sceneComponent.outId
        inOut.out[position] = activeComponent.component.outId
      }
    } else if (activeComponent && !sceneComponent) {
      inOut.out[position] = activeComponent.component.outId
    } else if (!activeComponent && sceneComponent) {
      inOut.in[position] = sceneComponent.outId
    }
  })
  return inOut
}
