type Stick = { x: number; y: number }
type ButtonState = { cross: boolean }

export class PS3DualShock {
  private buttons: ButtonState = { cross: false }
  private sticks = {
    left: { x: 0, y: 0 },
    right: { x: 0, y: 0 },
  }
  private crossPressedSinceLastPoll: boolean = false

  static async Connect(): Promise<PS3DualShock | null> {
    try {
      const filters = [{ vendorId: 0x054c, productId: 0x0268 }]
      const [device] = await navigator.hid.requestDevice({ filters })
      if (!device) return null

      await device.open()

      const wakeup = new Uint8Array([0x42, 0x0c, 0x00, 0x00])
      await device.sendFeatureReport(0xf4, wakeup)

      const pad = new PS3DualShock()

      device.addEventListener('inputreport', (e) => {
        const bytes = new Uint8Array(e.data.buffer)
        pad.parseReport(bytes)
      })

      return pad
    } catch (e) {
      console.warn("user action needed", e)
      return null
    }
  }

  private parseReport(bytes: Uint8Array) {
    // Buttons
    const crossNow = (bytes[1] & 0x04) !== 0
    if (!this.buttons.cross && crossNow) {
      this.crossPressedSinceLastPoll = true
    }
    this.buttons.cross = crossNow

    // Sticks (normalized -1..1)
    this.sticks.left.x = this.normalizeAxis(bytes[5])
    this.sticks.left.y = this.normalizeAxis(bytes[6])
    this.sticks.right.x = this.normalizeAxis(bytes[7])
    this.sticks.right.y = this.normalizeAxis(bytes[8])
  }

  private normalizeAxis(v: number): number {
    // 0–255 → -1..1 with center ~128
    return (v - 128) / 128
  }

  /** Call per frame */
  poll() {
    const pressed = { cross: this.crossPressedSinceLastPoll }
    this.crossPressedSinceLastPoll = false
    return {
      buttons: { ...this.buttons },
      sticks: {
        left: { ...this.sticks.left },
        right: { ...this.sticks.right },
      },
      pressed,
    }
  }
}
