import { InvalidParamError } from '@controllers/errors'
import { ImageArrayFieldValidator } from './image-array-field-validator'
import { ImageFieldValidator } from './image-field-validator'

interface SutTypes {
  sut: ImageArrayFieldValidator
}

const makeSut = (): SutTypes => ({
  sut: new ImageArrayFieldValidator('field1', 10),
})

const makeFile = ({ mimeType = 'image/jpg', size = 500 }) => ({
  mimeType,
  size,
  buffer: Buffer.from('any_value', 'utf-8'),
})

describe('ImageFieldValidator', () => {

  it('should not throw if param is not present', () => {
    const { sut } = makeSut()
    const givingBody = { field2: 2 }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

  it('should throw if some item is not an MultPartFile', () => {
    const { sut } = makeSut()
    const givingBody = { field1: [makeFile({}), 1] }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should throw if some file is not an image', () => {
    const { sut } = makeSut()
    const givingBody = {
      field1: [
        makeFile({}),
        makeFile({ mimeType: 'application/json' }),
      ],
    }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should throw if some file size is greater than the limit', () => {
    const { sut } = makeSut()
    const givingBody = {
      field1: [
        makeFile({}),
        makeFile({ size: 50 * 1024 * 1024 }),
      ],
    }

    expect(() => { sut.validate(givingBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should not throw if image is valid', () => {
    const { sut } = makeSut()
    const givingBody = {
      field1: [
        makeFile({}),
        makeFile({}),
      ],
    }

    expect(() => { sut.validate(givingBody) }).not.toThrow()
  })

})
