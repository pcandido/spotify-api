import { InvalidParamError } from '@controllers/errors'
import { ArrayMinSizeValidator } from './array-min-size-validator'

interface SutTypes {
  sut: ArrayMinSizeValidator
}

const makeSut = (): SutTypes => ({
  sut: new ArrayMinSizeValidator('field1', 2),
})

describe('ArrayMinSizeValidator', () => {

  it('should throw if array size is less than limit', () => {
    const { sut } = makeSut()
    const givenBody = { field1: [1] }

    expect(() => { sut.validate(givenBody) }).toThrow(new InvalidParamError('field1'))
  })

  it('should not throw if param is not present', () => {
    const { sut } = makeSut()
    const givenBody = {}

    expect(() => { sut.validate(givenBody) }).not.toThrow()
  })

  it('should not throw if array size is equal to limit', () => {
    const { sut } = makeSut()
    const givenBody = { field1: [1, 2] }

    expect(() => { sut.validate(givenBody) }).not.toThrow()
  })

  it('should not throw if array size is greater than limit', () => {
    const { sut } = makeSut()
    const givenBody = { field1: [1, 2, 3] }

    expect(() => { sut.validate(givenBody) }).not.toThrow()
  })

})
