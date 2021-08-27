import nodemailer from 'nodemailer'
import { EmailMessage, EmailSender } from '@usecases/protocols/email/email-sender'
import { EmailConfig } from './email-config'
import { Logger } from '@utils/logger'

export class NodeMailerAdapter implements EmailSender {

  constructor(
    private config: EmailConfig,
    private logger: Logger,
  ) { }

  async send(message: EmailMessage): Promise<void> {
    const transport = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.user,
        pass: this.config.password,
      },
    })

    const info = await transport.sendMail({
      from: `${this.config.sender} <${this.config.user}>`,
      to: message.to,
      subject: message.subject,
      text: message.body,
    })

    this.logger.info(`email sent to ${message.to}: ${info.messageId}`)
  }

}
