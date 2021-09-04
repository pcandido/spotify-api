import { ok } from '@controllers/helpers/http-helper'
import { AuthenticatedController, AuthenticatedRequest, Response, Validator } from '@controllers/protocols'

export class ArtistController implements AuthenticatedController {

  constructor(
    private validator: Validator,
  ) { }

  async handle(request: AuthenticatedRequest): Promise<Response> {
    this.validator.validate(request.body)
    return ok({})
  }

}
