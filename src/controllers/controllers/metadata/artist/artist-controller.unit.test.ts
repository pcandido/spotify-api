import { MultiPartFile, Validator } from '@controllers/protocols'
import { ArtistController } from './artist-controller'

interface SutTypes {
  sut: ArtistController,
  validatorStub: Validator
}

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate() {
      /* do nothing */
    }
  }
  return new ValidatorStub
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new ArtistController(validatorStub)

  return { sut, validatorStub }
}

const makeImage = (): MultiPartFile => ({
  originalName: 'any_name',
  size: 500,
  mimeType: 'image/jpg',
  buffer: Buffer.from('any_image', 'utf-8'),
})

const givenAccount = {
  id: '123',
  name: 'any name',
  email: 'any@email.com',
}

const givenName = 'any name'

const makeRequest = () => ({
  body: {
    name: givenName,
    image: makeImage(),
  },
  account: givenAccount,
})

describe('ArtistController', () => {

  it('should call validator with received body', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const givenRequest = makeRequest()

    await sut.handle(givenRequest)
    expect(validateSpy).toBeCalledWith(givenRequest.body)
  })

})
