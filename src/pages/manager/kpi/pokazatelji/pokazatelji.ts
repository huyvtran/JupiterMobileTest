import {Component} from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {NavController, IonicPage, ToastController} from 'ionic-angular';
//import { DatePicker } from '@ionic-native/date-picker';
import 'rxjs/add/operator/map';
import {ManagerKpiProvider} from '../../../../providers/managerkpi-provider';
import {GlobalProvider} from '../../../../providers/global-provider';
import {FavoritesProvider} from '../../../../providers/favorites-provider';

@IonicPage()
@Component({selector: 'page-manager-kpi-pokazatelji', templateUrl: 'pokazatelji.html'})
export class ManagerKpiPokazeteljiPage {
    cards : any = new Array < any > ();
    tip: string = "fav";
    action: number = 0;
    wait: boolean = true;

    constructor(public navCtrl : NavController, private http : Http, private managerKpiProvider: ManagerKpiProvider, 
        private globalProvider: GlobalProvider, private favoritesProvider: FavoritesProvider, private toastCtrl: ToastController) {
        this.init();
        managerKpiProvider.datum=new Date().toISOString();
        console.log(managerKpiProvider.datum);
        this.refreshPokazatelji();
    }

    private init() {
        Promise
        .resolve()
        .then(() => {
            return this.favoritesProvider.init("ManagerKpiTabsPage", "KPI", "Manager");
        });
    }


    setPokazatelji(action: number) {
        this.action = action;
        this.refreshPokazatelji();
    }

    refreshPokazatelji() {
        this.wait = true;
        this
            .getServerData(this.action)
            .then(data => {
                this.cards = data;
                this.wait = false;
            });
    }

    getServerData(action: number) {

        let opt : RequestOptions
        let headers : Headers = new Headers
        let operateriId: number = this.globalProvider.modulesProvider.storageRoot.operateriId;
        headers.set('Content-Type', 'application/json');

        let body = {
            "db": GlobalProvider.company.db,
            "action": action,
            "operateriId": operateriId,
            "datum": this.managerKpiProvider.datum
        };

        let data = JSON.stringify(body);

        opt = new RequestOptions({headers: headers});

        //var url = 'http://localhost:25509/api/partner/info/' + id;
        var url = GlobalProvider.loginData.serverPath + 'kpi/pokazatelji';

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

    


    getBackgroundColor(item) {
        return "red";
    }


    pokazateljiView(action: number) {
        //console.log(this.myDate);
        this.cards =  [];
        var self = this;
        self.setPokazatelji(action);
            
    }

    getBackgroundImage(item) {
        if (item.invertBool == true)
            return "url('assets/images/gauge-inverted.svg')";
        else
            return "url('assets/images/gauge.svg')";
    }

    getTitleColor(item) {
        return item.boja1;
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

//spManPortFavQuery @Action=0, @ID = " & operateriid