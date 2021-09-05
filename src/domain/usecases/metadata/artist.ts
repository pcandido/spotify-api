import { MultiPartFile } from '@controllers/protocols'
import { ArtistModel } from '@domain/models/artist'
import { CreateMetadata } from './metadata'

export interface CreateArtistModel {
  name: string
  description: string
  images: MultiPartFile[]
}

export type CreateArtist = CreateMetadata<CreateArtistModel, ArtistModel>
