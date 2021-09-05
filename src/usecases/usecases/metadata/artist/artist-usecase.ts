import { MultiPartFile } from '@controllers/protocols'
import { AccountPublicModel, ImageSet } from '@domain/models'
import { ArtistModel } from '@domain/models/artist'
import { CreateArtist, CreateArtistModel } from '@domain/usecases/metadata/artist'
import { ImagePersister } from '@usecases/protocols/image/image-persister'
import { ImageResizer } from '@usecases/protocols/image/image-resizer'
import { CreateArtistRepository } from '@usecases/protocols/metadata/artist/create-artist-repository'

export class ArtistUsecase implements CreateArtist {

  constructor(
    private imageResizer: ImageResizer,
    private imagePersister: ImagePersister,
    private createArtistRepository: CreateArtistRepository,
  ) { }

  async create(account: AccountPublicModel, artist: CreateArtistModel): Promise<ArtistModel> {

    const images = await this.persistImages(artist)
    return await this.createArtistRepository.create({
      name: artist.name,
      description: artist.description,
      ownerId: account.id,
      images,
    })

  }

  private async persistImages(artist: CreateArtistModel): Promise<ImageSet[]> {
    const getImageName = (image: MultiPartFile, size?: number) => `${artist.name} - ${image.originalName}${size ? '_' + size : ''}`

    const persisted = artist.images.map(async image => {

      const [img64, img256] = await Promise.all([
        this.imageResizer.resize(image.buffer, 64, 64),
        this.imageResizer.resize(image.buffer, 256, 256),
      ])

      const [uri, uri64, uri256] = await Promise.all([
        this.imagePersister.persist(getImageName(image), image.buffer),
        this.imagePersister.persist(getImageName(image, 64), img64),
        this.imagePersister.persist(getImageName(image, 256), img256),
      ])

      return { uri, uri64, uri256 } as ImageSet
    })

    return await Promise.all(persisted)
  }

}
