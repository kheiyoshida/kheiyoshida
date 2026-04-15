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
    super(camera, [tetraGraph1, tetraGraph2])
  }

  private updateCamera() {
    this.camera.theta += 0.001
    this.camera.phi = (Math.sin(performance.now() / 5000) * Math.PI) / 2
    this.camera.r = Math.sin(performance.now() / 2000) * 10.0 + 13
  }

  override draw() {
    this.updateCamera()

    for (const tetraGraph of this.tetraGraphs) {
      const s = (Math.sin(performance.now() / 1000) + 1) / 2.0
      tetraGraph.setScale(0.1 + s * 0.8)
      tetraGraph.setLength(Math.floor(s * 200))
    }

    super.draw()
  }
}
