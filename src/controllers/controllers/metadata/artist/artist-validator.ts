import { MissingParamValidator, ValidatorComposite } from '@controllers/helpers/validation'
import { ArrayMinSizeValidator } from '@controllers/helpers/validation/array-min-size-validator'
import { ImageArrayFieldValidator } from '@controllers/helpers/validation/image-array-field-validator'
import { Validator } from '@controllers/protocols'

export const artistValidator = (): Validator => new ValidatorComposite([
  new MissingParamValidator('name'),
  new MissingParamValidator('description'),
  new MissingParamValidator('images'),
  new ArrayMinSizeValidator('images', 1),
  new ImageArrayFieldValidator('images', 30),
])
