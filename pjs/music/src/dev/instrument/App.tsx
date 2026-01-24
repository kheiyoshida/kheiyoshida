import { useEffect } from 'react'
import { main } from './testInstrument.ts'

export const TestInstApp = () => {
  useEffect(() => {
    main()
  }, [])

  return null
}
