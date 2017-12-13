import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the PregledProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HrmResursiPregledProvider {
  vrijemeOd: string = new Date().toISOString();
  vrijemeDo: string = new Date().toISOString(); 
  filterResursi: any = [];
  filterCheckAll: boolean = true;

  public init:boolean=true;
  zauzeca : any = new Array <any> ();
  groupBy : string = '';
  HrResursiId:string='';
  
  selectedArray= [];
  multiselectObject:any = {};


  constructor(public http: Http) {

  }


      
}
