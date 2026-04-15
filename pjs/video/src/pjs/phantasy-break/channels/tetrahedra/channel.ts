import { Scene3DRenderingChannel } from '../../../../lib-node/channel/3D/scene'
import { OrbitCamera } from '../../../../lib/camera'
import { TetraGraph } from './model/tetrahedron'

export class TetrahedraChannel extends Scene3DRenderingChannel {
  protected readonly camera!: OrbitCamera
  protected get tetraGraphs(): TetraGraph[] {
    return this.drawObjects as TetraGraph[]
  }

  constructor() {
    const camera = new OrbitCamera()
    const tetraGraph1 = new TetraGraph(3)
    const tetraGraph2 = new TetraGraph(3)
    tetraGraph1.position = [1, 0, 0]
    tetraGraph2.position = [-1, 0, 0]
    super(camera, [tetraGraph1, tetraGraph2])
  }

  private cameraSpeed = 0.1

  private updateCamera() {
    this.camera.theta += this.cameraSpeed
    this.camera.phi =  (Math.sin(performance.now() / 1500)) * (Math.PI / 3)
    this.camera.r = Math.sin(performance.now() / 3000) * 2.0 + 2.2
  }

  override draw() {
    this.updateCamera()

    super.draw()
  }

  public setLength(level: number) {
    for (const tetraGraph of this.tetraGraphs) {
      tetraGraph.setLength(Math.floor(level * 20))
      tetraGraph.setScale(0.3 + level * 0.4)
      this.cameraSpeed = level * 0.1
    }
  }
}
