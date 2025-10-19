import { Channel } from './channel'
import { GenericModel } from 'graph-gl'

export class ObjectRenderingChannel extends Channel {
  public drawObjects: GenericModel[] = []

  constructor(models: GenericModel[] = []) {
    super()
    this.drawObjects = models
  }
}
