
import {Injectable} from '@angular/core';

import {GlobalProvider} from '../../core/global-provider';
import {StorageProvider} from '../../core/storage-provider';
import * as ICore from '../../../interfaces/ICore';

import {ConstProvider} from '../../core/const-provider';

@Injectable()
export class TerkomKomunikacijaProvider {


   
    constructor(private global: GlobalProvider, private storage: StorageProvider,
    private constants : ConstProvider) {
        
    }


    getSifarniciData() {
        let data : ICore.IData = {
            "queries": [
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "robe"
            },
           "tablename" : "roba"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "partneri",
                "operaterid" : "@@operaterid"
            },
           "tablename" : "partneri"
        },
         {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "rute",
                "operaterid" : "@@operaterid"
            },
           "tablename" : "rute"
        },
         {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "klase"
            },
           "tablename" : "klase"
        },
         {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "nacinisporuke"
            },
           "tablename" : "nacinisporuke"
        },
         {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "nacinplacanja"
            },
           "tablename" : "nacinplacanja"
        },
         {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "asortiman"
            },
           "tablename" : "asortiman"
        },
         {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "asortimanvrsta"
            },
           "tablename" : "asortimanvrsta"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "Action": "vrstadokumenta"
            },
           "tablename" : "vrstadokumenta"
        },
        {
            "query": "spmobTerkom_VarsQuery",
            "params": {
                "action": "getVars"
            },
           "tablename" : "pubvars"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "action": "izvjestaji"
            },
           "tablename" : "izvjestaji"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "action": "Skladista",
                 "operaterid" : "@@operaterid"
            },
           "tablename" : "skladista"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "action": "VrstaObilaska"
            },
           "tablename" : "vrstaobilaska"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "action": "RazlogPovrata"
            },
           "tablename" : "razlogpovrata"
        },
        {
            "query": "spMobTerkom_Upitnik",
            "params": {
                "action": "Upitnik"
            },
           "tablename" : "upitnici"
        },
         {
            "query": "spMobTerkom_Upitnik",
            "params": {
                "action": "Pitanje"
            },
           "tablename" : "pitanja"
        },
         {
            "query": "spMobTerkom_Upitnik",
            "params": {
                "action": "Odgovor"
            },
           "tablename" : "odgovori"
        },
        {
            "query": "spmobTerkom_DonosQuery",
            "params": {
                "action": "Obavijesti",
                "operaterid" : "@@operaterid"
            },
           "tablename" : "obavijesti"
        }
      ]
        }
        return this
            .global
            .getData(data);
     
    }

    
    saveToStorage(data: any) 
    {
        var promises = []

        this.constants.storageKeys.forEach(element => {
            if(data[element.keyname])
                promises.push(this.storage.addToStorage(element.keyvalue, null, data[element.keyname] , true))
        });

        return Promise.all(promises);
    }

}
