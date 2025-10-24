import { DefaultGoFrames, FPS, MAX_STATUS_VALUE } from '../../config'
import { StatusEventValues } from './delta.ts'

describe('status values requirements', () => {
  test(`within about a minute, player must reach the stair`, () => {
    const secs = 45
    const frames = FPS
    const maximumWalkTimes = (secs * frames) / DefaultGoFrames
    const estimatedWalkTimes = maximumWalkTimes / 2 // not sure about this

    const walkSanity = StatusEventValues['walk'].sanity
    const idleSanity = StatusEventValues['idle'].sanity
    const downstairsSanity = StatusEventValues['downstairs'].sanity

    const estimatedWalkSanityDelta = Math.abs(walkSanity * estimatedWalkTimes)
    const maximumSanityDelta = Math.abs(idleSanity * secs * frames)

    const estimatedSanityDeltaWithinAMinute = Math.abs(estimatedWalkSanityDelta - maximumSanityDelta)

    expect(Math.abs(estimatedSanityDeltaWithinAMinute - downstairsSanity)).toBeLessThanOrEqual(100)
  })
  test(`player needs to rest after walking for 10 seconds`, () => {
    const secs = 10
    const stepsInSecs = (secs * FPS) / DefaultGoFrames
    const estimatedSteps = stepsInSecs / 2

    const walkStamina = StatusEventValues['walk'].stamina
    const idleStamina = StatusEventValues['idle'].stamina

    // it makes the speed slow enough to make player want to rest
    const staminaDeltaAfterSecs = walkStamina * estimatedSteps

    const d = Math.abs(staminaDeltaAfterSecs) - MAX_STATUS_VALUE / 3
    expect(d).toBeLessThan(100)
    expect(d).toBeGreaterThan(-100)

    // by resting, it can heal up the stamina consumed
    const restSecs = 5
    const staminaHealAmount = restSecs * FPS * idleStamina

    expect(staminaHealAmount).toBeGreaterThan(Math.abs(staminaDeltaAfterSecs))

    const diff = Math.abs(staminaHealAmount - Math.abs(staminaDeltaAfterSecs))
    expect(diff).toBeLessThan(100)
  })
  test(`sanity needs to stay within two ranges (=600) until music completes the loop (=16 secs)`, () => {
    const loopSecs = 16
    const sanityRangeForMusicAlignment = 300 * 2

    const maximumIdleSanityDeltaWithinALoop = loopSecs * FPS * StatusEventValues['idle'].sanity
    expect(-maximumIdleSanityDeltaWithinALoop).toBeLessThanOrEqual(sanityRangeForMusicAlignment)

    const maximumStepsInALoop = (loopSecs * FPS) / DefaultGoFrames
    const maximumWalkSanityDeltaWithinALoop = maximumStepsInALoop * StatusEventValues['walk'].sanity
    expect(maximumWalkSanityDeltaWithinALoop).toBeLessThanOrEqual(sanityRangeForMusicAlignment)
  })
})
