import { ok, serverError } from '@controllers/helpers/http-helper'
import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'
import { CreateArtist } from '@domain/usecases/artist'
import { UserError } from '@errors/user-error'

export class CreateArtistController implements AuthenticatedController {

  constructor(
    private validator: Validator,
    private createArtist: CreateArtist,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    try {
      this.validator.validate(request.body)
      const created = await this.createArtist.create(request.account, request.body)
      return ok(created)
    } catch (error) {
      if (error instanceof UserError)
        return error.toResponse()
      else
        return serverError(error)
    }
  }

}
