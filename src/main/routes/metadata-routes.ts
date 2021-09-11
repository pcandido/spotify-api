
import { Router } from 'express'
import { adaptAuthenticatedRoute } from '@main/adapters/express-request-adapter'
import { makeCreateArtistController } from '@main/factories/metadata/artist'

export default (): Router => {
  const router = Router()

  router.route('/artist').post(adaptAuthenticatedRoute(makeCreateArtistController()))

  return router
}
