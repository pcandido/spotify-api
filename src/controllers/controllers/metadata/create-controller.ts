import { ok, serverError } from '@controllers/helpers/http-helper'
import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'
import { CreateMetadata } from '@domain/usecases/metadata'
import { UserError } from '@errors/user-error'

export class CreateMetadataController<T, R> implements AuthenticatedController {

  constructor(
    private validator: Validator,
    private createMetadata: CreateMetadata<T, R>,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const created = await this.createMetadata.create(request.account, request.body)
      return ok(created)
    } catch (error) {
      if (error instanceof UserError)
        return error.toResponse()
      else
        return serverError(error)
    }
  }

}
