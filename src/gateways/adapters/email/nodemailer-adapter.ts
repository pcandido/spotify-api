// import nodemailer from 'nodemailer'
// import config from './config'

import nodemailer from 'nodemailer'
import { EmailMessage, EmailSender } from '@usecases/protocols/email/email-sender'
import { EmailConfig } from './email-config'



// export interface EmailMessage {
//   to: string
//   subject: string
//   body: string
// }

// export async function sendEmail(message: EmailMessage) {

//   const transporter = nodemailer.createTransport({
//     host: config.email.host,
//     port: config.email.port,
//     secure: config.email.secure,
//     auth: {
//       user: config.email.user,
//       pass: config.email.password,
//     },
//   })

//   const { to, subject, body } = message

//   console.log(`sending email to ${to}`)

//   const info = await transporter.sendMail({
//     from: `"${config.email.name}" <${config.email.address}>`,
//     to,
//     subject,
//     html: body,
//   })

//   console.log(`Message sent: ${info.messageId}`)

// }

export class NodeMailerAdapter implements EmailSender {

  constructor(private config: EmailConfig) { }

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


  }

}
