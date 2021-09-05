import { ValidationError } from '@controllers/errors'
import { badRequest, ok, serverError } from '@controllers/helpers/http-helper'
import { Validator } from '@controllers/protocols'
import { AccountPublicModel } from '@domain/models'
import { CreateMetadata } from '@domain/usecases/metadata/metadata'
import { CreateMetadataController } from './create-controller'

interface CreateModel {
  name: string
}

interface Model {
  id: string
  name: string
}

interface SutTypes {
  sut: CreateMetadataController<CreateModel, Model>,
  validatorStub: Validator,
  createMetadataStub: CreateMetadata<CreateModel, Model>
}

const generatedId = 'generated-id'
const givenName = 'any name'

const makeValidatorStub = () => {
  class ValidatorStub implements Validator {
    validate() {
      /* do nothing */
    }
  }
  return new ValidatorStub
}

const makeCreateMetadataStub = () => {
  class CreateMetadataStub implements CreateMetadata<CreateModel, Model> {
    async create(account: AccountPublicModel, data: CreateModel): Promise<Model> {
      return {
        id: generatedId,
        name: data.name,
      }
    }
  }
  return new CreateMetadataStub()
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const createMetadataStub = makeCreateMetadataStub()
  const sut = new CreateMetadataController(validatorStub, createMetadataStub)

  return { sut, validatorStub, createMetadataStub }
}

const givenAccount = {
  id: '123',
  name: 'any name',
  email: 'any@email.com',
}

const makeRequest = () => ({
  body: {
    name: givenName,
  },
  account: givenAccount,
})

describe('CreateMetadataController', () => {

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

  it('should call CreateMetadata with received data', async () => {
    const { sut, createMetadataStub } = makeSut()
    const givenRequest = makeRequest()
    const setImageSpy = jest.spyOn(createMetadataStub, 'create')

    await sut.handle(givenRequest)
    expect(setImageSpy).toBeCalledWith(givenAccount, givenRequest.body)
  })

  it('should return 500 if CreateMetadata throws', async () => {
    const { sut, createMetadataStub } = makeSut()
    const givenError = new Error('any error')
    jest.spyOn(createMetadataStub, 'create').mockRejectedValueOnce(givenError)
    const result = await sut.handle(makeRequest())
    expect(result).toEqual(serverError(givenError))
  })

  it('should return 200 and the created data on success', async () => {
    const { sut } = makeSut()
    const result = await sut.handle(makeRequest())
    expect(result).toEqual(ok({
      id: generatedId,
      name: givenName,
    }))
  })

})
