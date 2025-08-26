
export async function setupCamera() {
  const videoEl = document.createElement('video')
  videoEl.srcObject = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  });
  await videoEl.play(); // needs user gesture on iOS
  return videoEl
}
