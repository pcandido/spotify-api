import { ArtistModel } from '@domain/models/artist'

export type CreateArtistRepositoryModel = Omit<ArtistModel, 'id'>

export interface CreateArtistRepository {

  create(artist: CreateArtistRepositoryModel): Promise<ArtistModel>

}
