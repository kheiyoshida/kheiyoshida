import { MidiInput } from '../../lib/input'
import { defaultScene, AdditiveLine, MovingPoint, MovingPointEmitter, mainCamera, setup } from '../../lib/presentation'
import * as THREE from 'three'

MovingPoint.decreaseSpeed = (movement) => {
  movement.setLength(Math.max(0, movement.length() / 1.01))
}

export const main = async () => {
  const renderer = setup()
  renderer.setClearColor(new THREE.Color(0.1, 0.1, 0.1))

  const camera = mainCamera()
  camera.position.set(0, 400, 0)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  const material = new THREE.LineBasicMaterial({ color: new THREE.Color(1, 1, 1) })
  const line = new AdditiveLine(1000, material)

  const nodeEmitter = new MovingPointEmitter()

  // setup event inputs
  const midiInput = await MidiInput.create('Logic Pro Virtual Out')
  midiInput.registerEvent('noteon', (note) => {
    const node = nodeEmitter.emit((note.pitch - 30) * 6, note.velocity / 100)
    line.addPoint(node)
  })

  // start loop
  const animate = () => {
    line.update()
    renderer.render(defaultScene(), mainCamera())

    nodeEmitter.rotateY(0.1)
  }
  renderer.setAnimationLoop(animate)
}
