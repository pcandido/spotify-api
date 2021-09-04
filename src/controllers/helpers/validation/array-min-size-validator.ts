import { InvalidParamError } from '@controllers/errors'
import { Validator } from '@controllers/protocols'

export class ArrayMinSizeValidator implements Validator {

  constructor(
    private field: string,
    private limit: number,
  ) { }

  validate(input: any): void {
    if (input[this.field] && input[this.field].length < this.limit)
      throw new InvalidParamError(this.field)
  }

}
