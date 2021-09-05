import { AddAccountModel } from '@domain/usecases/account/add-account'
import { AccountModel } from '@domain/models/account'

export interface AddAccountRepository{

  addAccount(account: AddAccountModel): Promise<AccountModel>

}
