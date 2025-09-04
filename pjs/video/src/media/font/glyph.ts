type Glyph = {
  id: number
  x: number
  y: number
  width: number
  height: number
  xoffset: number
  yoffset: number
  xadvance: number
}

export type UV = {
  uvMin: [number, number]
  uvMax: [number, number]
}

export class FntParser {
  private glyphs: Map<number, Glyph> = new Map()
  private texWidth: number
  private texHeight: number

  constructor(fntText: string, opts: { textureWidth: number; textureHeight: number }) {
    this.texWidth = opts.textureWidth
    this.texHeight = opts.textureHeight
    this.parse(fntText)
  }

  private parse(fntText: string) {
    const lines = fntText.split('\n')
    for (const line of lines) {
      if (line.startsWith('char id=')) {
        const kv: Record<string, string> = {}
        for (const pair of line.trim().split(/\s+/)) {
          const [key, value] = pair.split('=')
          kv[key] = value
        }

        const glyph: Glyph = {
          id: parseInt(kv['id']),
          x: parseInt(kv['x']),
          y: parseInt(kv['y']),
          width: parseInt(kv['width']),
          height: parseInt(kv['height']),
          xoffset: parseInt(kv['xoffset']),
          yoffset: parseInt(kv['yoffset']),
          xadvance: parseInt(kv['xadvance']),
        }

        this.glyphs.set(glyph.id, glyph)
      }
    }
  }

  getAttributes(char: string): UV {
    const code = char.charCodeAt(0)
    const glyph = this.glyphs.get(code)
    if (!glyph) throw new Error(`Glyph for character "${char}" not found`)

    const u0 = glyph.x / this.texWidth
    const v0 = glyph.y / this.texHeight
    const u1 = (glyph.x + glyph.width) / this.texWidth
    const v1 = (glyph.y + glyph.height) / this.texHeight

    // Flip vertically if texture origin is bottom-left
    return {
      uvMin: [u0, v0],
      uvMax: [u1, v1],
    }
  }
}
