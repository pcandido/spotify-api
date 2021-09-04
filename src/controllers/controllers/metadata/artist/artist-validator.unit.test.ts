import { MissingParamError, InvalidParamError } from '@controllers/errors'
import { Validator, MultiPartFile } from '@controllers/protocols'
import { artistValidator } from './artist-validator'

interface SutTypes {
  sut: Validator
}

const makeSut = (): SutTypes => {
  const sut = artistValidator()
  return { sut }
}

const makeImage = (): MultiPartFile => ({
  originalName: 'any_name',
  size: 500,
  mimeType: 'image/jpg',
  buffer: Buffer.from('any_image', 'utf-8'),
})

describe('ArtistValidator', () => {

  it('should throw if no name is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = { description: 'any description', images: makeImage() }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('name'))
  })

  it('should throw if no description is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = { name: 'any name', images: makeImage() }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('description'))
  })

  it('should throw if no image is provided', async () => {
    const { sut } = makeSut()
    const givenRequest = { name: 'any name', description: 'any description' }
    expect(() => sut.validate(givenRequest)).toThrow(new MissingParamError('images'))
  })

  it('should throw if image array is empty', async () => {
    const { sut } = makeSut()
    const givenRequest = { name: 'any name', description: 'any description', images: [] }
    expect(() => sut.validate(givenRequest)).toThrow(new InvalidParamError('images'))
  })

  it('should throw if any file mime type is not image', async () => {
    const { sut } = makeSut()
    const image1 = makeImage()
    const image2 = makeImage()
    image2.mimeType = 'application/json'

    const givenRequest = { name: 'any name', description: 'any description', images: [image1, image2] }
    expect(() => sut.validate(givenRequest)).toThrow(new InvalidParamError('images'))
  })

  it('should not throw if no validator throws', () => {
    const { sut } = makeSut()
    const givenRequest = { name: 'any name', description: 'any description', images: [makeImage()] }
    expect(() => sut.validate(givenRequest)).not.toThrow()
  })

})
