import nodemailer from 'nodemailer'
import { NodeMailerAdapter } from './nodemailer-adapter'
import { EmailMessage } from '@usecases/protocols/email/email-sender'
import { Logger } from '@utils/logger'

const sendMailFn = jest.fn().mockResolvedValue({ messageId: 'any-id' })

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({ sendMail: sendMailFn })),
}))

const makeConfig = () => ({
  host: 'any-host',
  port: 1234,
  secure: true,
  sender: 'any name',
  user: 'any@mail.com',
  password: 'any password',
})

const makeMessage = (): EmailMessage => ({
  to: 'any@email.com',
  subject: 'any subject',
  body: 'any body',
})

const makeLogger = (): Logger => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
})

const makeSut = () => {
  const config = makeConfig()
  const logger = makeLogger()
  return {
    sut: new NodeMailerAdapter(config, logger),
  }
}

describe('NodeMailerAdapter', () => {

  it('should use the given credentials', async () => {
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

  it('should send the given message and subject to the given destinatary', async () => {
    const { sut } = makeSut()
    const givenMessage = makeMessage()
    const givenConfig = makeConfig()

    await sut.send(givenMessage)

    expect(sendMailFn).toBeCalledWith({
      from: `${givenConfig.sender} <${givenConfig.user}>`,
      to: givenMessage.to,
      subject: givenMessage.subject,
      text: givenMessage.body,
    })
  })
})
