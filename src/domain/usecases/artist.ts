import { MultiPartFile } from '@controllers/protocols'
import { AccountPublicModel } from '@domain/models'
import { ArtistModel } from '@domain/models/artist'

export interface CreateArtistModel {
  name: string
  description: string
  image: MultiPartFile
}

export interface CreateArtist {
  create(account: AccountPublicModel, artist: CreateArtistModel): Promise<ArtistModel>
}
