/* eslint-disable no-extra-semi */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { scheduleLoop } from '../mgnr-tone/tone-wrapper/utils'

/**
 * simply run callback by provided loop times
 */
export const mockScheduleLoop = (...[cb, _, __, numOfLoops]: Parameters<typeof scheduleLoop>) => {
  ;[...Array(numOfLoops)].map((_, loopNth) => {
    cb(loopNth, loopNth)
  })
  return 0 // assignId
}
