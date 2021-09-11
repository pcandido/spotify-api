import { artistValidator } from '@controllers/controllers/metadata/artist/artist-validator'
import { CreateMetadataController } from '@controllers/controllers/metadata/create-controller'
import { ControllerLogger } from '@controllers/decorators/controller-logger'
import { Controller } from '@controllers/protocols'
import { JimpAdapter } from '@gateways/adapters/jimp-adapter/jimp-adapter'
import { S3Adapter } from '@gateways/adapters/s3-adapter/s3-adapter'
import { ArtistMongoRepository } from '@gateways/repositories/metadata/artist/artist-mongo-repository'
import { ArtistUsecase } from '@usecases/usecases/metadata/artist/artist-usecase'
import config from '@utils/config'
import { ConsoleLoggerAdapter } from '@utils/console-logger-adapter'

export const makeCreateArtistController = ():Controller => {
  const { accessKeyId, secretAccessKey, endpoint, bucketName } = config.s3
  const imageResizer = new JimpAdapter()
  const imagePersister = new S3Adapter(accessKeyId, secretAccessKey, endpoint, bucketName)
  const createArtistRepository = new ArtistMongoRepository()
  const createMetadata = new ArtistUsecase(imageResizer, imagePersister, createArtistRepository)
  const validator = artistValidator()
  const artistController = new CreateMetadataController(validator, createMetadata)
  const consoleLoggerAdapter = new ConsoleLoggerAdapter()
  return new ControllerLogger(artistController, consoleLoggerAdapter)
}
