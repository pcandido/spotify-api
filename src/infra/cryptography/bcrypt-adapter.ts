import bcrypt from 'bcrypt'
import { Encrypter } from '@data/protocols/cryptography/encrypter'

export class BCryptAdapter implements Encrypter {

  constructor(private salt: number = 12) { }

  async encrypt(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

}
