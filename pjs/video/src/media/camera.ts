import { VideoSource } from '../lib/source/source'

export class CameraInputSource implements VideoSource {
  currentVideo: HTMLVideoElement

  static async create(deviceLabel?: string): Promise<CameraInputSource> {
    const stream = await getCameraInputStream(deviceLabel)
    const videoEl = document.createElement('video')
    videoEl.srcObject = stream;
    await videoEl.play() // needs user gesture on iOS
    return new CameraInputSource(videoEl, stream)
  }

  private constructor(cameraVideoEl: HTMLVideoElement, stream: MediaStream) {
    this.currentVideo = cameraVideoEl

    const videoTrack = stream.getVideoTracks()[0];

    videoTrack.addEventListener("ended", () => {
      console.warn("Camera track ended (device removed?)");
      this.health = false
    });

    videoTrack.addEventListener("mute", () => {
      console.warn("Camera track muted (device temporarily unavailable?)");
      this.health = false
    });

    videoTrack.addEventListener("unmute", () => {
      console.log("Camera track restored");
      this.health = true
    });
  }

  private health = true;
  public get isAvailable(): boolean {
    return this.health
  }
}

export async function getCameraInputStream(cameraName?: string) {
  let deviceId: string | undefined = undefined
  if (cameraName) {
    deviceId = await searchDeviceId(cameraName)
  }

  return await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      ...(deviceId ? { deviceId: { exact: deviceId } } : {}),
    },
    audio: false,
  })
}

const searchDeviceId = async (deviceName: string) => {
  const list = await navigator.mediaDevices.enumerateDevices()
  const found = list.find((m) => m.label.includes(deviceName))
  if (!found)
    throw new Error(`No device found for device ${deviceName}. 
    list: ${list
      .map((m) => m.label)
      .filter(Boolean)
      .join(', ')}`)
  return found.deviceId
}
