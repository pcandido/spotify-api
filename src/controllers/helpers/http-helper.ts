import { Response } from '@controllers/protocols'
import { AuthenticationError } from '@controllers/errors/authentication-error'
import { ServerError } from '@errors/server-error'

export const ok = <T>(body: T): Response => ({
  statusCode: 200,
  body,
})

export const created = <T>(body: T): Response => ({
  statusCode: 201,
  body,
})

export const badRequest = (error: Error): Response => ({
  statusCode: 400,
  body: error,
})

export const unauthorized = (error: AuthenticationError): Response => ({
  statusCode: 401,
  body: error,
})

export const serverError = (error: Error | unknown): Response => ({
  statusCode: 500,
  body: new ServerError((error instanceof Error) ? error : undefined),
})
