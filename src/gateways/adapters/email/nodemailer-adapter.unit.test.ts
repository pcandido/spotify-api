import nodemailer from 'nodemailer'
import { NodeMailerAdapter } from './nodemailer-adapter'
import { EmailMessage } from '@usecases/protocols/email/email-sender'

jest.mock('nodemailer')

const makeConfig = () => ({
  host: 'any-host',
  port: 1234,
  secure: true,
  user: 'any@mail.com',
  password: 'any password',
})

const makeMessage = (): EmailMessage => ({
  to: 'any@email.com',
  subject: 'any subject',
  body: 'any body',
})

const makeSut = () => {
  const config = makeConfig()
  return {
    sut: new NodeMailerAdapter(config),
  }
}

describe('NodeMailerAdapter', () => {

  it('should create a Transport with correct credentials', async () => {
    const { sut } = makeSut()
    const givenMessage = makeMessage()
    const config = makeConfig()

    await sut.send(givenMessage)

    expect(nodemailer.createTransport).toBeCalledWith({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    })
  })

})
