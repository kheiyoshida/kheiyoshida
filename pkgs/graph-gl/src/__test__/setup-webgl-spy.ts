// test/setup-webgl-spy.ts
import 'jest-canvas-mock';

let mockGL: WebGL2RenderingContext;

export function createWebGL2SpyContext(): WebGL2RenderingContext {
  if (mockGL) return mockGL;

  const gl = (document.createElement('canvas').getContext('webgl2') ??
    {}) as WebGL2RenderingContext;

  const noop = () => {};

  const methodsToSpy = [
    'useProgram',
    'bindFramebuffer',
    'framebufferTexture2D',
    'activeTexture',
    'bindTexture',
    'drawArrays',
    'drawElements',
    'clear',
  ] as const;

  for (const key of methodsToSpy) {
    (gl as any)[key] = jest.fn(noop);
  }

  mockGL = gl;
  return gl;
}

// --- Hook to automatically mock the module ---
jest.mock('../domain/gl/gl', () => ({
  getGL: jest.fn(() => createWebGL2SpyContext()),
}));

console.log('[setup-webgl-spy] WebGL2 context automatically mocked');

beforeEach(() => jest.clearAllMocks())
