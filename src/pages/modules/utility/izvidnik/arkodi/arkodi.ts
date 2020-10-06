import {Component, ViewChild} from '@angular/core';
import { IonicPage, ToastController, NavController } from 'ionic-angular';

//import _ from 'lodash';

import {BasePage} from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import { UtilityIzvidnikProvider } from '../../../../../providers/modules/utility/izvidnik/utility-izvidnik-provider';

declare var window;

@IonicPage({priority: 'high'})
@Component({selector: 'page-izvidnik-arkodi', templateUrl: 'arkodi.html'})
export class IzvidnikArkodiPage extends BasePage {

    term : string = '';

    private items : any = [];
    private arkodi : Array < any > = new Array < any > ();
    
    constructor(private toastCtrl: ToastController, private navCtrl: NavController, private izvidnikProvider:UtilityIzvidnikProvider) {
        super();

        this.initData();
    
    }

    getData() {
        let dataDef : ICore.IData = {
            "queries": [
                {
                    "query": "spMobRatIzv",
                    "params": {
                        "action": "sviarkodi"
                    },
                    "tablename": "arkod"
                }
            ]
        }
        return this
            .global
            .getData(dataDef);

    }

    initData(){
        this
            .getData()
            .then(data => {
                if (data != null)
                    this.arkodi = data.arkod;
            }).then( res => {

                for (let i = 0; i < 30; i++) {
                    if (this.arkodi[i] != undefined && this.arkodi[i] != null)
                        this.items.push(this.arkodi[i]);
                }
            })

    }

    reviver(key, value) : any
    {
        if ('naziv' === key) {
            return value.toLowerCase();
            // return value.replace(/\w\S*/g, function(txt){return
            // txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        return value;
    }

    searchFn(ev : any) {
        this.term = ev.target.value;

        this.items.splice(0, this.items.length)
        
        this.izvidnikProvider.getSearchResults(this.term).then(res=> {

            this.arkodi = res

            if (this.term == '')
                this.initData();
            else
            {
                for (let i = 0; i < 30; i++) 
                {
                    if (this.arkodi[i] != undefined && this.arkodi[i] != null)
                        this.items.push(this.arkodi[i]);
                }
        }
        })
    }

    spremiArkod(selectedId:number, naziv:string, oznaka:string, povrsina: number){

        this.izvidnikProvider.parametriIzv.ID = selectedId
        this.izvidnikProvider.parametriIzv.Naziv = naziv
        this.izvidnikProvider.parametriIzv.Oznaka = oznaka
        this.izvidnikProvider.parametriIzv.Povrsina = povrsina

        if (selectedId)
            this.izvidnikProvider.getPlanSjetve(selectedId).then( res => {

                if (res.plansjetve != null && res.plansjetve.length > 0){
                this.izvidnikProvider.planSjetve.KultureId = res.plansjetve[0].kultureid
                this.izvidnikProvider.planSjetve.SorteId = res.plansjetve[0].sorteid

                this.toastCtrl.create()

                }

            });

        this.navCtrl.pop();
        
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');
    
        setTimeout(() => {

          for (let i = 0; i < 30; i++) {
              if(this.arkodi[this.items.length + i] != undefined)
                this.items.push(this.arkodi[this.items.length + i]);
          }
    
          console.log('Async operation has ended');
          infiniteScroll.complete();

        if (this.items.length == this.arkodi.length) {
            infiniteScroll.disabled = true;
        }
        }, 500);
      }
    

}
