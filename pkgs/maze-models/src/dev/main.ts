import { GeometryPreviewer } from './preview'
import { ModelSize } from '../models'
import { generateTile } from '../models/generators/tile'
import { generatePole } from '../models/generators/pole'

const geo = generatePole(1)(ModelSize.Small, 0)

new GeometryPreviewer(geo)
