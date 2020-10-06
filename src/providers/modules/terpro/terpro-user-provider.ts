import { Injectable } from '@angular/core';

import * as ITerproUser from '../../../interfaces/terpro/ITerproUser';

import { ConstProvider } from '../../core/const-provider';
import { TerproDataProvider } from './terpro-data-provider';
import {StorageProvider} from '../../core/storage-provider';
import {VariableProvider} from '../../core/variable-provider';
//import {ModulesProvider} from '../../core/modules-provider';



@Injectable()
export class TerproUserProvider {

	public  loginInfo : ITerproUser.ITerproUser = null;

 	//operaterId = this.constants.operaterId;//ModulesProvider.storageRoot? ModulesProvider.storageRoot.operateriid : null;
	operaterId = this.variable.company ? this.variable.company.operateriid : null;

  	constructor(public constants:ConstProvider, private dataServis : TerproDataProvider, private storage : StorageProvider, private variable : VariableProvider) {}
	



  	getUserInfo(): Promise<any>{

		let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "user");

        return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {

					this.loginInfo = <ITerproUser.ITerproUser>val;
					console.log(this.loginInfo)
                    resolve(this.loginInfo);
                }, (error) => {
                    reject(error);
                });
        });

  	}

  	
  	setSyncDate() {

		  let key = this.constants.terProStorageKeys.find((r: any) => r.keyname === "user");

		 return new Promise((resolve, reject) => {
            this.storage.getFromStorage(key.keyvalue, null, true)
                .then((val) => {
					let user = null;
					if(val){
						user = <ITerproUser.ITerproUser>this.storage.getFirstArrayElement(val);
						//console.log(user)
						user.syncDate = new Date();
						user.operaterId = this.operaterId;
					}
						

                    resolve(this.storage.addToStorage(key.keyvalue, null, user, true));
                }, (error) => {
                    reject(error);
                });
        });

  	}
  	
}
