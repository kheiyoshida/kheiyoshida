/**
 * provide preset function that accepts options to override the default
 * @param defaultOptions
 * @param preset function to construct preset
 * @returns preset object
 */
export const providePreset =
  <Preset, O>(defaultOptions: O, preset: (options: O) => Preset) =>
  (options?: Partial<O>): Preset =>
    preset({
      ...defaultOptions,
      ...options,
    })
