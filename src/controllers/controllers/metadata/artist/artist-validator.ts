import { MissingParamValidator, ValidatorComposite } from '@controllers/helpers/validation'
import { ImageFieldValidator } from '@controllers/helpers/validation/image-field-validator'
import { Validator } from '@controllers/protocols'

export const artistValidator = (): Validator => new ValidatorComposite([
  new MissingParamValidator('name'),
  new MissingParamValidator('description'),
  new MissingParamValidator('image'),
  new ImageFieldValidator('image', 10),
])
