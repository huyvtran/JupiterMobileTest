import {VariableProvider} from './variable-provider';


import {Injectable} from '@angular/core';

import {StorageProvider} from './storage-provider';

@Injectable()
export class PermissionProvider  {


    //permissioni iz jupiter admina
    public ssPermisions : Array<any> = [];

    constructor(private storageProvider : StorageProvider, private variable: VariableProvider) {
 
        // this.initStorage();
    }
    
   
    isVisible(functionName: string) : boolean {
        //provjeri u arrayu permissiona za function 
        let values = this.storageProvider.filterCollectionSingleValue(this.ssPermisions, 'functionname', functionName)

        if(values != null)
         return values ? values.visible : true
		return false;
	}

    isEnabled(functionName: string) : boolean {
        //console.log(this.ssPermisions)
        //provjeri u arrayu permissiona za function 
        let values = this.storageProvider.filterCollectionSingleValue(this.ssPermisions, 'functionname', functionName)

        if(values != null)
         return values ? values.enabled : true
		return false;
	}
}