import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

const givenSecretPhrase = 'secret_phrase'
const givenPayload = { field1: 1, field2: '2' }
const generatedToken = 'generated_token'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return generatedToken
  },
}))

describe('JwtAdapter', () => {

  it('should call sign with correct values', () => {
    const sut = new JwtAdapter(givenSecretPhrase)
    const signSpy = jest.spyOn(jwt, 'sign')
    sut.generate(givenPayload)
    expect(signSpy).toBeCalledWith(givenPayload, givenSecretPhrase)
  })

  it('should return the jwt result', () => {
    const sut = new JwtAdapter(givenSecretPhrase)
    const token = sut.generate(givenPayload)
    expect(token).toBe(generatedToken)
  })

  it('should not handle Jwt errors', () => {
    const sut = new JwtAdapter(givenSecretPhrase)
    const givenError = new Error('any_error')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw givenError })
    expect(() => sut.generate(givenPayload)).toThrow(givenError)
  })

})
