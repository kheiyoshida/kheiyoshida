import { getAudioCtx } from './analyzer'

export const createAudioInputSource = async (audioInputName?: string) => {
  const stream = await getAudioInputStream(audioInputName)

  const [track] = stream.getAudioTracks();

// This gives you what the browser *actually used*
  const settings = track.getSettings();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  console.log("Settings:", settings.deviceId, settings.label);

// Compare against enumerateDevices
  const devices = await navigator.mediaDevices.enumerateDevices();
  const matched = devices.find(d => d.deviceId === settings.deviceId);
  console.log("Matched device:", matched);


  const context = getAudioCtx()
  return context.createMediaStreamSource(stream);
}

const getAudioInputStream = async (audioInputName?: string) => {
  let deviceId: string | undefined = undefined
  if (audioInputName) {
    deviceId = await searchDeviceId(audioInputName)
  }
  
  return await navigator.mediaDevices.getUserMedia({
    ...(deviceId ? { audio: { deviceId: { exact: deviceId } } } : { audio: true }),
  })
}

const searchDeviceId = async (deviceName: string) => {
  const list = await navigator.mediaDevices.enumerateDevices()
  console.log(list)
  const found = list.find((m) => m.label.includes(deviceName))
  if (!found)
    throw new Error(`No device found for device ${deviceName}. 
    list: ${list
      .map((m) => m.label)
      .filter(Boolean)
      .join(', ')}`)
  return found.deviceId
}
