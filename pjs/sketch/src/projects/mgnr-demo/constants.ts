// general
export const FrameRate = 30
export const MOBILE_WIDTH = 800

// field
export const FieldRange = 4000
export const VisibleRange = FieldRange * 1.2
export const LookAhead = FieldRange * 1.5
export const CenterToOutsideDistance = FieldRange * 2
export const GroundY = 100

// camera
export const ZeroSpeed = 1
export const DefaultSpeed = 15
export const DegreesPerLookAngle = 30

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

// roomVar
export const MinRoomVar = 10
export const InitialRoomVar = 25
export const InitialNumOfTrees = InitialRoomVar
export const MaxRoomVar = 40
export const RoomVarMaxDelta = 10

// control
export const SwipeOneEquivalent = 500
export const SwipeMoveThreshold = 20 / SwipeOneEquivalent
export const SightAngleWidth = 160
export const MouseControlThreshold = 0.02