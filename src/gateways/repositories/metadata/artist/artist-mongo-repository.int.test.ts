import { ArtistMongoRepository } from './artist-mongo-repository'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { Collection } from 'mongodb'
import { ImageSet } from '@domain/models'

describe('AccountMongoRepository', () => {

  let artistCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    artistCollection = await MongoHelper.getCollection('artists')
    await artistCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.close()
  })

  const makeSut = () => new ArtistMongoRepository()
  const makeArtist = () => ({
    name: 'any name',
    description: 'any description',
    ownerId: 'any-id',
    images: [
      {
        uri: 'https://image1',
        uri64: 'https://image1_64',
        uri256: 'https://image1_256',
      },
      {
        uri: 'https://image2',
        uri64: 'https://image2_64',
        uri256: 'https://image2_256',
      },
    ] as ImageSet[],
  })

  describe('addAcount', () => {
    it('should return an artist on success', async () => {
      const sut = makeSut()
      const added = await sut.create(makeArtist())

      expect(added).toEqual({ ...makeArtist(), id: expect.anything() })
    })
  })


})
