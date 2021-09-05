import { ArtistModel } from '@domain/models/artist'
import { MongoHelper } from '@gateways/helpers/mogodb-helper'
import { CreateArtistRepository, CreateArtistRepositoryModel } from '@usecases/protocols/metadata/artist/create-artist-repository'

export class ArtistMongoRepository implements CreateArtistRepository{

  async create(artist: CreateArtistRepositoryModel): Promise<ArtistModel> {
    const artistCollection = await MongoHelper.getCollection('artists')
    const { insertedId } = await artistCollection.insertOne({ ...artist })
    return { ...artist, id: insertedId }
  }

}
