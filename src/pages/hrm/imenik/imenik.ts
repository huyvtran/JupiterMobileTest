import {Component} from '@angular/core';
import {App, IonicPage, NavController, ToastController} from 'ionic-angular';
import {Http, RequestOptions, Headers} from '@angular/http';

import {GlobalProvider} from '../../../providers/core/global-provider';
import {FavoritesProvider} from '../../../providers/core/favorites-provider';
//import _ from 'lodash';

declare var window;

@IonicPage({priority: 'high'})
@Component({selector: 'page-hrm-imenik', templateUrl: 'imenik.html'})
export class HrmImenikPage {
    term : string = '';

    private imenik : Array < any > = new Array < any > ();
    constructor(private http : Http, private app : App, private navCtrl: NavController, private favoritesProvider : FavoritesProvider, private globalProvider : GlobalProvider, private toastCtrl: ToastController) {
        this.init();
        this
            .getServerData()
            .then(data => {
                if (data != null)
                    this.imenik = data.djelatnici;
            });
    }

    private init() {

        // var tt : Array < any > = new Array < any > ();
        // var j = this
        //     .globalProvider
        //     .modulesProvider
        //     .permission
        //     .map(x => x.group);
        // console.log(j);

        // var t = _.map(this.globalProvider.modulesProvider.permission, 'group'); // → [1, 2]

        // //   .filter({ type: 'date' })   .value();

        Promise
            .resolve()
            .then(() => {
                return this
                    .favoritesProvider
                    .init("HrmImenikPage", "HRM - imenik", "HRM - Ljudski resursi");
            });
    }

    getServerData() {
        let opt : RequestOptions
        let headers : Headers = new Headers

        headers.set('Content-Type', 'application/json');

        let body = {
            "Db": GlobalProvider.getCompanyData.db
        };

        let data = JSON.stringify(body);

        opt = new RequestOptions({headers: headers});

        var url = GlobalProvider.getLoginData.serverPath + 'hrm/imenik';
        console.log(url);
        var response = this
            .http
            .post(url, data, opt)
            .toPromise()
            .then(result => JSON.parse(result.text(), this.reviver))
            .catch(err => {
                this.presentToastError(err._body);
            });
        return response;
        
        // var response = this
        //     .http
        //     .get(url)
        //     .map(res => JSON.parse(res.text(), this.reviver));
        // return response;
    }

    reviver(key, value) : any
    {
        if ('djelatnik' === key) {
            return value.toLowerCase();
            // return value.replace(/\w\S*/g, function(txt){return
            // txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        }
        return value;
    }

    searchFn(ev : any) {
        this.term = ev.target.value;
    }

    goBack() {

    }

    call(item) {
         window.location = "tel:" + item.mobitel;
    }

    doubleTap() {
        this.closePage();
    }

    closePage() {
        //this.globalProvider.pullPage();
        // this
        //     .app
        //     .getRootNav()
        //     .setRoot('CoreAppModulesPage', {}, {
        //         animate: true,
        //         direction: 'backward'
        //     });

    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }


}
