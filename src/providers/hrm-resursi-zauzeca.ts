import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as Moment from 'moment'
@Injectable()
export class HrmResursiZauzecaProvider {
    resursi: any = new Array<any>();
    danasDatum: string = new Date().toISOString().slice(0, 10);

    public vriOd: string = Moment().local().add(1, 'hour').minutes(0).seconds(0).milliseconds(0).format();
    public vriDo: string = Moment().local().add(2, 'hour').minutes(0).seconds(0).milliseconds(0).format();
    public params = {};
    public SelectedResursi=[];
    public showFooter:boolean=false;
    public memo:string = '';
    textAreaMargin:string = '0px';
    public resursList;

    groupBy : string = '';

    constructor(public http: Http) { 
    }

    public getSelectedResursiString() {
        this.resursList = '';
    
        this.SelectedResursi.forEach(resurs => {
         this.resursList = this.resursList +  resurs + ',' + '<br>'
        });
        this.resursList = this.resursList.substring(0, this.resursList.length-5)
        return this.resursList;
      }
    
      public showHideFooter() {
          if (this.SelectedResursi.length>0)
          {
              this.showFooter=true;
          }
          else
          {
              this.showFooter=false;
              this.memo = '';
              this.textAreaMargin = '0px';
          }
      }
}