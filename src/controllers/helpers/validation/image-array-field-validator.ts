import { InvalidParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'

export class ImageArrayFieldValidator implements Validator {

  constructor(
    private fieldName: string,
    private sizeLimitMB: number,
  ) { }

  validate(input: any): void {
    const value = input[this.fieldName]

    if (!value) return

    for (const file of value) {
      if (!file.mimeType || !file.size || !file.buffer)
        throw new InvalidParamError(this.fieldName)

      if (!file.mimeType.match(/^image\//g))
        throw new InvalidParamError(this.fieldName)

      if (file.size > this.sizeLimitMB * 1024 * 1024)
        throw new InvalidParamError(this.fieldName)
    }

  }

}
