import { Shader } from '../../gl/shader'
import { ScreenPass } from '../../gl/pass/pass'
import { ScreenRect, ScreenRect2 } from '../../gl/model/screen'
import { FrameBuffer } from '../../gl/frameBuffer'

export class PostEffect {
  public screenPass:ScreenPass = new ScreenPass()
  private screenRect

  constructor(frameBuffer: FrameBuffer) {
    this.screenRect = new ScreenRect2(frameBuffer)
  }

  public render() {
    this.screenPass.render([this.screenRect])
  }
}
