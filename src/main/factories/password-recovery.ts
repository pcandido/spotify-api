import path from 'path'
import config from '@utils/config'
import { PasswordRecoveryController } from '@controllers/controllers/account/password-recovery/password-recovery-controller'
import { passwordRecoveryValidator } from '@controllers/controllers/account/password-recovery/password-recovery-validator'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { Controller } from '@controllers/protocols'
import { JwtAdapter } from '@gateways/adapters/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@gateways/repositories/acount/account-mongo-repository'
import { PasswordRecoveryUseCase } from '@usecases/usecases/password-recovery/password-recovery-usecase'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'
import { EmailValidatorAdapter } from '@utils/email-validator-adapter'
import { NodeMailerAdapter } from '@gateways/adapters/email/nodemailer-adapter'

export const makePasswordRecoveryController = (): Controller => {
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  const emailSender = new NodeMailerAdapter({ ...config.email }, consoleLoggerAdapter)
  const tokenGenerator = new JwtAdapter(config.app.jwt.secret)
  const loadByEmailRepository = new AccountMongoRepository()
  const passwordRecovery = new PasswordRecoveryUseCase(
    loadByEmailRepository,
    tokenGenerator,
    emailSender,
    config.app.passwordRecovery.expiresInMinutes,
    path.join(__dirname, '..', '..', '..', 'templates', 'password-recovery-email-subject.text'),
    path.join(__dirname, '..', '..', '..', 'templates', 'password-recovery-email-template.md'),
    config.app.passwordRecovery.resetUrl,
  )
  const emailValidator = new EmailValidatorAdapter()
  const validator = passwordRecoveryValidator(emailValidator)
  const passwordRecoveryController = new PasswordRecoveryController(validator, passwordRecovery)
  return new ControllerLogger(passwordRecoveryController, consoleLoggerAdapter)
}
