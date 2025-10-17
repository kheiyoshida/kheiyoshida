// test/setup-webgl-spy.ts
import 'jest-canvas-mock'

let mockGL: WebGL2RenderingContext

export function createWebGL2SpyContext(): WebGL2RenderingContext {
  if (mockGL) return mockGL

  const canvas = document.createElement('canvas')
  const gl =
    canvas.getContext('webgl2') ??
    ({
      canvas,
    } as WebGL2RenderingContext)

  const noop = () => {}

  const methodsToSpy = [
    'useProgram',
    'bindFramebuffer',
    'framebufferTexture2D',
    'activeTexture',
    'bindTexture',
    'drawArrays',
    'drawElements',
    'clear',
    'createTexture',
    'texImage2D',
    'texParameteri',
    'createFramebuffer',
    'drawBuffers',
    'createShader',
    'shaderSource',
    'compileShader',
    'getShaderParameter',
    'getShaderInfoLog',
    'createProgram',
    'attachShader',
    'linkProgram',
    'createVertexArray',
    'createBuffer',
    'bindVertexArray',
    'bindBuffer',
    'bufferData',
    'getAttribLocation',
    'enableVertexAttribArray',
    'vertexAttribPointer',
    'getUniformLocation',
    'uniform1i',
    'viewport',
    'clearColor',
  ] as const

  for (const key of methodsToSpy) {
    ;(gl as any)[key] = jest.fn(noop)
  }

  gl.getShaderParameter = jest.fn(() => ({}))
  gl.getProgramParameter = jest.fn(() => ({}))
  gl.getShaderInfoLog = jest.fn(() => 'ok')

  mockGL = gl
  return gl
}

// --- Hook to automatically mock the module ---
jest.mock('../gl/gl', () => ({
  getGL: jest.fn(() => createWebGL2SpyContext()),
}))

console.log('[setup-webgl-spy] WebGL2 context automatically mocked')

beforeEach(() => jest.clearAllMocks())
