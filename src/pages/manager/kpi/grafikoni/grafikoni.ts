import { Component } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { NavController, IonicPage, ToastController } from 'ionic-angular';
import { ManagerKpiProvider } from '../../../../providers/managerkpi-provider';
import { GlobalProvider } from '../../../../providers/global-provider';
import { FavoritesProvider } from '../../../../providers/favorites-provider';

@IonicPage()
@Component({
  selector: 'page-manager-kpi-grafikoni',
  templateUrl: 'grafikoni.html'
})
export class ManagerKpiGrafikoniPage {
    cards : any = new Array<any> ();
    wait: boolean = true;

    
    constructor(public navCtrl : NavController, private http : Http, private managerKpiProvider: ManagerKpiProvider,
        private globalProvider: GlobalProvider, private favoritesProvider: FavoritesProvider, private toastCtrl: ToastController) {
        this.init();
        this.refreshPokazatelji();
    }

    private init() {
        Promise
        .resolve()
        .then(() => {
            return this.favoritesProvider.init("ManagerKpiTabsPage", "KPI", "Manager");
        });
    }

    startModule(item, datumDo) {
        this.navCtrl.push('ManagerKpiGrafPage', item);

    }

     refreshPokazatelji() {
        this.wait = true;
        this
            .getServerData()
            .then(data => {
                this.wait = false;
                this.cards = data;
            });
    }


    getServerData() {

        let opt : RequestOptions
        let headers : Headers = new Headers
        let operateriId: number = this.globalProvider.modulesProvider.storageRoot.operateriId;
        headers.set('Content-Type', 'application/json');

        let body = {
            "db": GlobalProvider.company.db,
            //"operateriId": operateriId,
            "operateriId": 7,
            "datum": this.managerKpiProvider.datum
        };

        let data = JSON.stringify(body);

        opt = new RequestOptions({headers: headers});

        var url = GlobalProvider.loginData.serverPath + 'kpi/grafikoni';

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

    goBack() {
        this.globalProvider.pullPage();
    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

}
