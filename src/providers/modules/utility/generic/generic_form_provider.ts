
import { Injectable } from '@angular/core';

import * as ICore from '../../../../interfaces/ICore';
import * as IFile from '../../../../interfaces/modules/dms/IFile';
import * as Moment from 'moment'

import { GlobalProvider } from '../../../core/global-provider';


/*
  Generated class for the IzvidnikProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GenericFormProvider {
    parametri: IParametri = {
        partnerinaziv: '',
        partneriid: null,
        datumod: null,
        datumdo: null
    };

    searchString: string = "";
    refreshData : boolean = true;
    constructor(private global: GlobalProvider) {

        this.parametri.datumod = new Date().toISOString();
        this.parametri.datumdo = new Date().toISOString();
        this.searchString = Moment(this.parametri.datumod).format("DD.MM.YYYY") + ' - ' + Moment(this.parametri.datumdo).format("DD.MM.YYYY");
    }



    sendFile(file: IFile.File) {
        console.log("saljem")
        console.log(file)

        let properties: ICore.IPropertiesCore = {
            customApiEndPoint: "dms/insert"
        }

        let dataDef: ICore.IData = {
            "queries": [
                {
                    "query": "xxx",
                    "params": {
                        "file": file.content,
                        "filename": file.filename,
                        "entityname": file.entitiyname,
                        "id": file.entitiyid
                    }
                }
            ]
        };

        return this.global.getData(dataDef, properties);

    }


    getDatePeriod(numDays: number){
        
        let datumOd: string = Moment(new Date()).subtract(numDays, 'days').toISOString();

        return datumOd;

    }


}

export interface IParametri {
    partneriid?: number,
    partnerinaziv: string,
    datumod: string,
    datumdo: string,
}

