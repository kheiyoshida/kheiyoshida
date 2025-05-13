import * as THREE from 'three'

let scene: THREE.Scene
export const defaultScene = () => {
  if (!scene) throw new Error('Scene is missing')
  return scene
}

let camera: THREE.PerspectiveCamera
export const mainCamera = () => {
  if (!camera) throw new Error('Camera is not defined')
  return camera
}

export const setup = () => {
  // scene & camera
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000)

  // prepare renderer
  const renderer = new THREE.WebGLRenderer()

  // Render at 50% resolution internally
  renderer.setSize(window.innerWidth, window.innerHeight, false)

  // // But keep canvas CSS size the same
  // renderer.domElement.style.width = `${window.innerWidth}px`
  // renderer.domElement.style.height = `${window.innerHeight}px`
  //
  // // PixelRatio controls scaling from framebuffer to screen
  // renderer.setPixelRatio(1) // Don't upscale, keep 1:1 texel

  document.body.appendChild(renderer.domElement)

  return renderer
}
