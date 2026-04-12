import { mat4, vec3 } from 'gl-matrix'
import { clamp } from 'utils'

export class OrbitCamera {
  public r = 3
  public theta = Math.PI / 2

  public _phi = 0
  public get phi() {
    return this._phi
  }
  public set phi(v: number) {
    this._phi = clamp(v, -Math.PI /2 + 0.001, Math.PI / 2 - 0.001)
  }

  public speed = 0.005

  public getViewMatrix() {
    const x = this.r * Math.cos(this.phi) * Math.cos(this.theta)
    const y = this.r * Math.sin(this.phi)
    const z = this.r * Math.cos(this.phi) * Math.sin(this.theta)

    const mat = mat4.create()

    mat4.lookAt(mat, vec3.fromValues(x, y, z), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0))

    return mat
  }

  public getProjectionMatrix(
    fov = Math.PI / 3,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.1,
    far = 100
  ) {
    const proj = mat4.create()

    mat4.perspective(proj, fov, aspect, near, far)

    return proj
  }
}

export class OrbitCameraControl {
  private readonly element: HTMLElement
  private readonly camera: OrbitCamera

  private isPointerDown = false
  private lastPointerX = 0
  private lastPointerY = 0

  private lastPinchDistance: number | null = null
  private readonly activeTouches = new Map<number, { x: number; y: number }>()

  public rotateSpeed = 1
  public zoomSpeed = 0.01
  public minR = 1
  public maxR = 30

  public constructor(camera: OrbitCamera, element: HTMLElement) {
    this.camera = camera
    this.element = element

    this.element.style.touchAction = 'none'

    this.element.addEventListener('pointerdown', this.onPointerDown)
    this.element.addEventListener('pointermove', this.onPointerMove)
    this.element.addEventListener('pointerup', this.onPointerUp)
    this.element.addEventListener('pointercancel', this.onPointerUp)
    this.element.addEventListener('wheel', this.onWheel, { passive: false })
  }

  public dispose() {
    this.element.removeEventListener('pointerdown', this.onPointerDown)
    this.element.removeEventListener('pointermove', this.onPointerMove)
    this.element.removeEventListener('pointerup', this.onPointerUp)
    this.element.removeEventListener('pointercancel', this.onPointerUp)
    this.element.removeEventListener('wheel', this.onWheel)

    this.activeTouches.clear()
    this.lastPinchDistance = null
    this.isPointerDown = false
  }

  private readonly onPointerDown = (e: PointerEvent) => {
    this.element.setPointerCapture(e.pointerId)

    if (e.pointerType === 'touch') {
      this.activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (this.activeTouches.size === 1) {
        this.lastPointerX = e.clientX
        this.lastPointerY = e.clientY
      }

      if (this.activeTouches.size === 2) {
        this.lastPinchDistance = this.getCurrentPinchDistance()
      }

      return
    }

    this.isPointerDown = true
    this.lastPointerX = e.clientX
    this.lastPointerY = e.clientY
  }

  private readonly onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') {
      if (!this.activeTouches.has(e.pointerId)) return

      const previous = this.activeTouches.get(e.pointerId)
      this.activeTouches.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (this.activeTouches.size === 1 && previous) {
        const dx = e.clientX - previous.x
        const dy = e.clientY - previous.y
        this.rotate(dx, dy)
      }

      if (this.activeTouches.size === 2) {
        const distance = this.getCurrentPinchDistance()

        if (distance != null && this.lastPinchDistance != null) {
          const delta = distance - this.lastPinchDistance
          this.zoom(-delta * 5.)
        }

        this.lastPinchDistance = distance
      }

      return
    }

    if (!this.isPointerDown) return

    const dx = e.clientX - this.lastPointerX
    const dy = e.clientY - this.lastPointerY

    this.lastPointerX = e.clientX
    this.lastPointerY = e.clientY

    this.rotate(dx, dy)
  }

  private readonly onPointerUp = (e: PointerEvent) => {
    if (this.element.hasPointerCapture(e.pointerId)) {
      this.element.releasePointerCapture(e.pointerId)
    }

    if (e.pointerType === 'touch') {
      this.activeTouches.delete(e.pointerId)

      if (this.activeTouches.size < 2) {
        this.lastPinchDistance = null
      }

      return
    }

    this.isPointerDown = false
  }

  private readonly onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.zoom(e.deltaY)
  }

  private rotate(dx: number, dy: number) {
    this.camera.theta += dx * this.camera.speed * this.rotateSpeed
    this.camera.phi += dy * this.camera.speed * this.rotateSpeed
  }

  private zoom(delta: number) {
    this.camera.r += delta * this.zoomSpeed
    this.camera.r = clamp(this.camera.r, this.minR, this.maxR)
  }

  private getCurrentPinchDistance() {
    if (this.activeTouches.size !== 2) return null

    const touches = Array.from(this.activeTouches.values())
    const a = touches[0]
    const b = touches[1]

    return Math.hypot(b.x - a.x, b.y - a.y)
  }
}
