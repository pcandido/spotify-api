import { ValidationError } from '@controllers/errors'
import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { MultiPartFile, Validator } from '@controllers/protocols'
import { AccountPublicModel, ImageSet } from '@domain/models'
import { ArtistModel } from '@domain/models/artist'
import { CreateArtist, CreateArtistModel } from '@domain/usecases/artist'
import { CreateArtistController } from './create-artist-controller'

interface SutTypes {
  sut: CreateArtistController,
  validatorStub: Validator,
  createArtistStub: CreateArtist
}

const generatedId = 'generated-id'
const givenName = 'any name'
const givenImageSet: ImageSet = {
  uri: 'uri',
  uri64: 'uri64',
  uri256: 'uri256',
}

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate() {
      /* do nothing */
    }
  }
  return new ValidatorStub
}

const makeCreateArtistStub = () => {
  class CreateArtistStub implements CreateArtist {
    async create(account: AccountPublicModel, artist: CreateArtistModel): Promise<ArtistModel> {
      return {
        id: generatedId,
        name: artist.name,
        ownerId: account.id,
        image: givenImageSet,
      }
    }
  }
  return new CreateArtistStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const createArtistStub = makeCreateArtistStub()
  const sut = new CreateArtistController(validatorStub, createArtistStub)

  return { sut, validatorStub, createArtistStub }
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

const makeRequest = () => ({
  body: {
    name: givenName,
    image: makeImage(),
  },
  account: givenAccount,
})

describe('CreateArtistController', () => {

  it('should call validator with received body', async () => {
    const { sut, validatorStub } = makeSut()
    const validateSpy = jest.spyOn(validatorStub, 'validate')
    const givenRequest = makeRequest()

    await sut.handle(givenRequest)
    expect(validateSpy).toBeCalledWith(givenRequest.body)
  })

  it('should reuturn bad request if validator throws', async () => {
    const { sut, validatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new ValidationError('')
    jest.spyOn(validatorStub, 'validate').mockImplementation(() => { throw givenError })

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(badRequest(givenError))
  })

  it('should reuturn 500 if validator throws internal error', async () => {
    const { sut, validatorStub } = makeSut()
    const givenRequest = makeRequest()
    const givenError = new Error('')
    jest.spyOn(validatorStub, 'validate').mockImplementation(() => { throw givenError })

    const response = await sut.handle(givenRequest)
    expect(response).toEqual(serverError(givenError))
  })

  it('should call CreateArtist with received data', async () => {
    const { sut, createArtistStub } = makeSut()
    const givenRequest = makeRequest()
    const setImageSpy = jest.spyOn(createArtistStub, 'create')

    await sut.handle(givenRequest)
    expect(setImageSpy).toBeCalledWith(givenAccount, givenRequest.body)
  })

  it('should return 500 if CreateArtist throws', async () => {
    const { sut, createArtistStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(createArtistStub, 'create').mockRejectedValueOnce(givenError)
    const result = await sut.handle(makeRequest())
    expect(result).toEqual(serverError(givenError))
  })

  it('should return 200 and the artist set on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeRequest())
    expect(result).toEqual(ok({
      id: generatedId,
      name: givenName,
      ownerId: givenAccount.id,
      image: givenImageSet,
    }))
  })

})
