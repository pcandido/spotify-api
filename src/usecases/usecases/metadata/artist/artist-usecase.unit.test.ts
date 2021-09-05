import { AccountPublicModel } from '@domain/models'
import { CreateArtistModel } from '@domain/usecases/artist'
import { ImagePersister } from '@usecases/protocols/image/image-persister'
import { ImageResizer } from '@usecases/protocols/image/image-resizer'
import { CreateArtistRepository, CreateArtistRepositoryModel } from '@usecases/protocols/metadata/artist/create-artist-repository'
import { ArtistUsecase } from './artist-usecase'

interface SutTypes {
  sut: ArtistUsecase
  imageResizerStub: ImageResizer
  imagePersisterStub: ImagePersister
  createArtistRepositoryStub: CreateArtistRepository
}

const givenAccountId = 'account-id'
const generatedId = 'generated-id'

const makeImageResizerStub = (): ImageResizer => {
  class ImageResizerStub implements ImageResizer {
    async resize(image: Buffer, width: number, height: number): Promise<Buffer> {
      return Buffer.from(`${image.toString('utf-8')} - ${width}x${height}`, 'utf-8')
    }
  }
  return new ImageResizerStub()
}

const makeImagePersisterStub = () => {
  class ImagePersisterStub implements ImagePersister {

    async persist(fileName: string): Promise<string> {
      return `https://${fileName}`
    }

  }
  return new ImagePersisterStub()
}

const makeCreateArtistRepositoryStub = () => {
  class CreateArtistRepositoryStub implements CreateArtistRepository {
    async create(artist: CreateArtistRepositoryModel) {
      return {
        id: generatedId,
        ...artist,
      }
    }
  }
  return new CreateArtistRepositoryStub()
}

const makeSut = (): SutTypes => {
  const imageResizerStub = makeImageResizerStub()
  const imagePersisterStub = makeImagePersisterStub()
  const createArtistRepositoryStub = makeCreateArtistRepositoryStub()
  const sut = new ArtistUsecase(imageResizerStub, imagePersisterStub, createArtistRepositoryStub)

  return { sut, imageResizerStub, imagePersisterStub, createArtistRepositoryStub }
}

const makeAccount = (): AccountPublicModel => ({
  id: givenAccountId,
  name: 'any name',
  email: 'any@email.com',
})

const makeImage = (name: string) => ({
  originalName: name,
  size: 500,
  mimeType: 'image/jpg',
  buffer: Buffer.from(name, 'utf-8'),
})

const makeArtist = (): CreateArtistModel => ({
  name: 'any name',
  description: 'any description',
  images: [makeImage('image1'), makeImage('image2')],
})

describe('ArtistUsecase', () => {

  it('should persist all the received images, original plus 64x64 plus 256x256', async () => {
    const { sut, imagePersisterStub } = makeSut()
    const persistSpy = jest.spyOn(imagePersisterStub, 'persist')
    const givenArtist = makeArtist()

    await sut.create(makeAccount(), givenArtist)

    expect(persistSpy).toBeCalledWith('any name - image1', Buffer.from('image1', 'utf-8'))
    expect(persistSpy).toBeCalledWith('any name - image1_64', Buffer.from('image1 - 64x64', 'utf-8'))
    expect(persistSpy).toBeCalledWith('any name - image1_256', Buffer.from('image1 - 256x256', 'utf-8'))
    expect(persistSpy).toBeCalledWith('any name - image2', Buffer.from('image2', 'utf-8'))
    expect(persistSpy).toBeCalledWith('any name - image2_64', Buffer.from('image2 - 64x64', 'utf-8'))
    expect(persistSpy).toBeCalledWith('any name - image2_256', Buffer.from('image2 - 256x256', 'utf-8'))
  })

  it('should not handle imageResizer internal errors', async () => {
    const { sut, imageResizerStub } = makeSut()
    const givenArtist = makeArtist()
    const givenError = new Error('any error')
    jest.spyOn(imageResizerStub, 'resize').mockRejectedValueOnce(givenError)

    await expect(() => sut.create(makeAccount(), givenArtist)).rejects.toThrow(givenError)
  })

  it('should not handle imagePersister internal errors', async () => {
    const { sut, imagePersisterStub } = makeSut()
    const givenArtist = makeArtist()
    const givenError = new Error('any error')
    jest.spyOn(imagePersisterStub, 'persist').mockRejectedValueOnce(givenError)

    await expect(() => sut.create(makeAccount(), givenArtist)).rejects.toThrow(givenError)
  })

  it('should persist given artist with persisted images and owner', async () => {
    const { sut, createArtistRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(createArtistRepositoryStub, 'create')
    const givenArtist = makeArtist()

    await sut.create(makeAccount(), givenArtist)

    expect(createSpy).toBeCalledWith({
      name: givenArtist.name,
      description: givenArtist.description,
      images: [
        {
          uri: 'https://any name - image1',
          uri256: 'https://any name - image1_256',
          uri64: 'https://any name - image1_64',
        },
        {
          uri: 'https://any name - image2',
          uri256: 'https://any name - image2_256',
          uri64: 'https://any name - image2_64',
        },
      ],
      ownerId: givenAccountId,
    })
  })

  it('should not handle repository internal errors', async () => {
    const { sut, createArtistRepositoryStub } = makeSut()
    const givenArtist = makeArtist()
    const givenError = new Error('any error')
    jest.spyOn(createArtistRepositoryStub, 'create').mockRejectedValueOnce(givenError)

    await expect(() => sut.create(makeAccount(), givenArtist)).rejects.toThrow(givenError)
  })

  it('should return persisted artist', async () => {
    const { sut } = makeSut()
    const givenArtist = makeArtist()

    const created = await sut.create(makeAccount(), givenArtist)

    expect(created).toEqual({
      id: generatedId,
      name: givenArtist.name,
      description: givenArtist.description,
      images: [
        {
          uri: 'https://any name - image1',
          uri256: 'https://any name - image1_256',
          uri64: 'https://any name - image1_64',
        },
        {
          uri: 'https://any name - image2',
          uri256: 'https://any name - image2_256',
          uri64: 'https://any name - image2_64',
        },
      ],
      ownerId: givenAccountId,
    })
  })

})
