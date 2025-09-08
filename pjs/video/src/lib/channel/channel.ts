import { VideoSource } from '../source/source'

/**
 * abstracts operations below:
 * - preparing offscreen renderer
 * - render video onto offscreen buffer
 * - read pixel data from the buffer
 * - set parameters for read operation
 */
export abstract class Channel<VS extends VideoSource = VideoSource> {
  protected constructor(readonly source: VS) {}

  // TODO: provide normalised interface for controller
}
