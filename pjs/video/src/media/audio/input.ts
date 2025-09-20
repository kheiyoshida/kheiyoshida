import { getAudioCtx } from './analyzer'

export const createAudioInputSource = async (audioInputName?: string) => {
  const stream = await getAudioInputStream(audioInputName)
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
