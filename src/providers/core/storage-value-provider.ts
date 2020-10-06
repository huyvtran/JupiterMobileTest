
import {Injectable} from '@angular/core';

import _ from 'lodash';

@Injectable()
export class StorageValueProvider {

    public removeFirstNElements(array: Array<any>, numberOfElements : number = 1)
    {
        return _.drop(array, numberOfElements);        
    }

    public removeLastNElements(array: Array<any>, numberOfElements : number = 1)
    {
        return _.dropRight(array, numberOfElements);        
    }


    public getFirstArrayElement(array: Array<any>){
        return _.head(array);
    }

    public getLastArrayElement(array : Array<any>){
        return _.last(array);
    }


    public findArrayIndex(array: Array<any>, key: string, value: any){
        return _.findIndex(array, [key, value]);
    }

    public findArrayIndexMulti(array: Array<any>,params : any){
        return _.findIndex(array, params);
    }

    //filter
    public filterCollection(data : Array<any>, key: string, value: any){
        return _.filter(data, [key, value]);
    }

    public filterCollectionSingleValue(data : Array<any>, key: string, value: any){
        let res =  _.filter(data, [key, value]);
        if(res && res.length === 1)
            return res[0]
        else
            return res
    }

    public filterMultiCollection(data : Array<any>, params: any){
        return _.filter(data, params);
    }


    public filterCollectionWherePopertyNotEqual(data : Array<any>, property: string, value: any){
        return _.filter(data, function(o) { return o[property] != value; });
    }

    public filterCollectionWherePopertGreatherThan(data : Array<any>, property: string, value: number){
        return _.filter(data, function(o) { return o[property] > value; });
    }

    public filterCollectionWherePopertLessThan(data : Array<any>, property: string, value: number){
        return _.filter(data, function(o) { return o[property] < value; });
    }

    public orderItemsBy(data: Array<any>, property:string, action:string){
        return _.orderBy(data, [property], [action]);
    }

    public groupItemsBy(data: Array<any>, property : any){
        return _.groupBy(data, property);
    }
    

    public filterMultiCollectioSingleValue(data : Array<any>, params: any){
         let res =  _.filter(data, params);
        if(res && res.length === 1)
            return res[0]
        else
            return res
    }
    
    public getMaxPropertyValueFromArray(array: Array<any>,property : any){
        return  _.maxBy(array, property)
     }
     
    // //getFirstArrayElementIndex
    // public searchCollectionByProperty(data: any, property: string, value : any){
    //     return _.find(data, [property, value]);
    // } 
    //  //getFirstArrayElementIndex
    // public searchCollectionByMultiProperty(data: Array<any>, params : any){
    //     return _.find(data, params);
    // } 


    //CRUD ARRAY funkcije

    addPropertyToArrayObject(data: Array<any>, propName : string, propValue : any){

        data.map(function(item){
            item[""+ propName +""] = propValue;
        })   
        return data;
    }    


    addItemToArray(data : Array<any>, item : any){
        return data.push(item);
    }

}