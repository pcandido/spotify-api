import { AccountPublicModel } from '@domain/models'

export interface CreateMetadata<T, R> {
  create(account: AccountPublicModel, artist: T): Promise<R>
}
