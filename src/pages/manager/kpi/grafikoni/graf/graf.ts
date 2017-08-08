import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { NavController, NavParams, IonicPage, ToastController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { ViewChild } from '@angular/core';

import { GlobalProvider } from '../../../../../providers/core/global-provider';
import { ManagerKpiProvider } from '../../../../../providers/managerkpi-provider';

@IonicPage()
@Component({selector: 'page-manager-kpi-graf', templateUrl: 'graf.html'})
export class ManagerKpiGrafPage {
    wait: boolean = true;
    title: string;
    output : any = new Array <any> ();

    @ViewChild('barCanvas')barCanvas;
    barChart : any;
    item: any;

    constructor(public navCtrl : NavController, public navParams : NavParams, private http: Http, private managerKpiProvider: ManagerKpiProvider, private globalProvider: GlobalProvider, private toastCtrl: ToastController) {
        this.item = navParams.data;
        this.title = navParams.data.naziv;
        this.getData();
    } 
    
    getData() {
        this.wait = true;
        this
            .getServerData()
            .then(data => {
                this.wait = false;
                this.barChart = new Chart(this.barCanvas.nativeElement, data);
            });
    }


    getServerData() {

        let opt : RequestOptions
        let headers : Headers = new Headers
        let operateriId: number = this.globalProvider.modulesProvider.storageRoot.operateriId;
        headers.set('Content-Type', 'application/json');

        let body = {
            "db": GlobalProvider.getCompanyData.db,
            "manPokGrafikonId": this.item.manPokGrafikonId,
            "datumDo": this.managerKpiProvider.datum,
            "korak": this.item.korak,
            "period": this.item.period,
            "operateriId": operateriId
        };

        let data = JSON.stringify(body);

        opt = new RequestOptions({headers: headers});

        var url = GlobalProvider.getLoginData.serverPath + 'kpi/grafikondata';

        var response = this
            .http
            .post(url, data, opt)
            .toPromise()
            .then(result => result.json())
            .catch(err => {
                this.presentToastError(err._body);
            });
        return response;
    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

    //  getServerData() {
         
    //     var url = 'http://213.202.75.122:30080/spinmobile/api/kpi/grafikondata/' + 
    //             this.item.manPokGrafikonId  + '/25/' + 
    //             this.managerKpiProvider.datum + '/' + 
    //             this.item.korak + '/' + 
    //             this.item.period;

    //     return this
    //         .http
    //         .get(url)
    //         //.timeout(1000, null)
    //         .map(res => res.json())
    // }
}