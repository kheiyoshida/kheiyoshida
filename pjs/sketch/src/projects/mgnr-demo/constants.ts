export const FieldRange = 3000

export const VisibleRange = FieldRange * 1.2
export const LookAhead = FieldRange * 1.5
export const CenterToOutsideDistance = FieldRange * 2

export const GroundY = 100

export const InitialNumOfTrees = 30

export const FrameRate = 30

// thresholds
export const eventThresholdSeconds = 2.5
export const eventThresholdSeconds2 = 5
export const eventThresholdSeconds3 = 10
export const eventThresholdSeconds4 = 20
export const eventThresholdSeconds5 = 80

export const EventThresholdFrameNumber1 = eventThresholdSeconds * FrameRate
export const EventThresholdFrameNumber2 = eventThresholdSeconds2 * FrameRate
export const EventThresholdFrameNumber3 = eventThresholdSeconds3 * FrameRate
export const EventThresholdFrameNumber4 = eventThresholdSeconds4 * FrameRate
export const EventThresholdFrameNumber5 = eventThresholdSeconds5 * FrameRate

export const SilentThreshold = 20
export const LoudThreshold = 30

export const SECONDS_TO_CHANGE_ATTITUDE = 2.5
export const AttitudeThresholdFrames = FrameRate * SECONDS_TO_CHANGE_ATTITUDE

export const MinRoomVar = 10
export const InitialRoomVar = 30
export const MaxRoomVar = 40

export const SwipeOneEquivalent = 500
export const SwipeMoveThreshold = 20 / SwipeOneEquivalent

export const SightAngleWidth = 160
