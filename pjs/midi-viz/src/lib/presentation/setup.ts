import * as THREE from 'three'

let scene: THREE.Scene
export const defaultScene = () => {
  if (!scene) {
    throw new Error('Scene is missing')
  }
  return scene
}

let camera: THREE.PerspectiveCamera
export const mainCamera = () => {
  if (!camera) {
    throw new Error('Camera is not defined')
  }
  return camera
}

export const setup = () => {
  // scene & camera
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500)


  // prepare renderer
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  return renderer
}
