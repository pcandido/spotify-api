import { ImageSet } from './image'

export interface ArtistModel {
  id: string
  name: string
  description: string
  ownerId: string
  images: ImageSet[]
}
