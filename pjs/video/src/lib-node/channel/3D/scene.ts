import { Drawable } from 'graph-gl'
import { Channel } from '../channel'
import { mat4 } from 'gl-matrix'

export type I3DDrawable = Drawable & {
  setProjectionMatrix(m: mat4): void
  setViewMatrix(m: mat4): void
}

export type I3DCamera = {
  getViewMatrix(): mat4
  getProjectionMatrix(): mat4
}

export abstract class Scene3DRenderingChannel extends Channel {
  protected drawObjects: I3DDrawable[]
  protected camera: I3DCamera

  protected constructor(camera: I3DCamera, drawables: I3DDrawable[]) {
    super()
    this.camera = camera
    this.drawObjects = drawables

    this.drawObjects.forEach((obj) => {
      obj.setProjectionMatrix(this.camera.getProjectionMatrix())
    })
  }

  public override draw() {
    this.drawObjects.forEach((obj) => {
      obj.setViewMatrix(this.camera.getViewMatrix())
      obj.draw()
    })
  }
}
