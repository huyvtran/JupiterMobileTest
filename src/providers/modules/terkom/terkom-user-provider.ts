import { Injectable } from '@angular/core';

import * as ITerkomUser from '../../../interfaces/terkom/ITerkomUser';

import { ConstProvider } from '../../core/const-provider';
import { TerkomDataProvider } from './terkom-data-provider';
import {StorageProvider} from '../../core/storage-provider';
import {ModulesProvider} from '../../core/modules-provider';
import {VariableProvider} from '../../core/variable-provider';


@Injectable()
export class TerkomUserProvider {

	 //operaterId = ModulesProvider.storageRoot? ModulesProvider.storageRoot.operateriid : null;
	 operaterId =  this.variable.company ? this.variable.company.operateriid : null

  	constructor(public constants:ConstProvider, private variable: VariableProvider, private dataServis : TerkomDataProvider, private storage : StorageProvider) {}
	



  	getUserInfo(): Promise<any>{

		let key = this.constants.terkomUserKey.keyvalue;

        return new Promise((resolve, reject) => {
            this.dataServis.getDataFromStorage(key)
                .then((val) => {
                    resolve(val);
                }, (error) => {
                    reject(error);
                });
        });

  	}

  	
  	setSyncDate() {

		let key = this.constants.terkomUserKey.keyvalue;
		let user = new ITerkomUser.ITerkomUser()
  		user.syncDate = new Date();	
		user.operaterId = this.operaterId;

        return new Promise((resolve, reject) => {

			resolve(this.storage.addToStorage(key, null, user, true));
	
		})
	  
  	}
  	
}
