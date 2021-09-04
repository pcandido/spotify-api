import { ImageSet } from './image'

export interface ArtistModel {
  id: string
  name: string
  ownerId: string,
  image: ImageSet
}
