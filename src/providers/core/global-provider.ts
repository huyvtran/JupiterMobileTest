import {Injectable} from '@angular/core';
import {App, ToastController, NavController} from 'ionic-angular';

import {ModulesProvider} from './modules-provider';
import {VariablesProvider} from './variables-provider';
import {ConstProvider} from './const-provider';
import {FavoritesProvider} from './favorites-provider';

import {Storage} from '@ionic/storage';

@Injectable()
export class GlobalProvider {
    //***const begin*/
    public static get getVersion() : string { return ConstProvider.version };
    public static get getJupiterServerPath() : string {return ConstProvider.jupiterServerPath};
    public static get getCoreStorageKeys() : any {return ConstProvider.coreStorageKeys};
    //***const end*/

    //***variables begin */
    public static get getLoginData() : any { return VariablesProvider.loginData };
    public static get getJupiterSystemData() : any { return VariablesProvider.jupiterSystemData };
    public static get getCompanyData() : any { return VariablesProvider.company };
    //*history*//
    public static get getPagesHistory() : Array <string> {return VariablesProvider.pagesHistory};
    public static set setPagesHistory(value) {VariablesProvider.pagesHistory = value};
    //***variables end */



    private static app: App;

    constructor(public modulesProvider : ModulesProvider, private favoritesProvider: FavoritesProvider, public app : App, private storage : Storage, public toastCtrl : ToastController) {
        GlobalProvider.app = app;
    }

    // //vraća trenutnu stranicu getActivePage(navCtrl : NavController) : string {
    //   return navCtrl         .getActive()         .name; }

    public getApplicationName() : string {return this.modulesProvider.applicationName;}

    public getSubTitle() : string {
        
        let companyName = "" //GlobalProvider.company.name;
        let userName = "";

        if (GlobalProvider.getCompanyData != null && GlobalProvider.getCompanyData.name != null) 
            companyName = GlobalProvider.getCompanyData.name;
        
        if (GlobalProvider.getJupiterSystemData != null && GlobalProvider.getJupiterSystemData.user != null && GlobalProvider.getJupiterSystemData.user.name != null) 
            userName = GlobalProvider.getJupiterSystemData.user.name;
        
        if (companyName != null && companyName != "") 
            companyName += " - ";
        else 
            companyName = "";
        
        return companyName + userName;
    }

    public getAppModules() : any[] {
        return this.modulesProvider.apps;
        // let data = this.modulesProvider.modules.find(x => x.company == "Spin")[0];
        // console.log(data);

    }

    public getInfoModules() : any {return this.modulesProvider.infoModules;}


    get navCtrl(): NavController {
        return this.app.getActiveNav();
    }

    public pullPage(type: string) {
        if (this.navCtrl.canGoBack())
            this.navCtrl.pop({});
        else {
            //ukloni zadnji zapis
            if (GlobalProvider
                .getPagesHistory != null && GlobalProvider
                .getPagesHistory.length > 1) 
            {
                GlobalProvider
                    .getPagesHistory
                    .pop();
                //zadnji (predzadnji) zapis
                var page = GlobalProvider.getPagesHistory[GlobalProvider.getPagesHistory.length - 1];

                if (page != null) {
                    this
                        .app
                        .getRootNav()
                        .setRoot(page, {}, {
                            animate: true,
                            direction: 'backward'
                        })
                }
                
            }
        }

        
    }

    public static pushPage(page : string) {
        GlobalProvider
            .getPagesHistory
            .push(page);
        this
            .app
            .getRootNav()
            .setRoot(page, {}, {
                animate: true,
                direction: 'forward'
            });
    }

    public closeCC() {
        this
            .storage
            .remove(GlobalProvider.getCoreStorageKeys.company);
        this.modulesProvider.ClearData();
        VariablesProvider.company = null;

        
                this
                    .app
                    .getRootNav()
                    .setRoot("CoreCcCompanyPage", {}, {
                        animate: true,
                        direction: 'backward'
                    })
        

        //this.pullPage('');
    }

    uIzradi() {
        let message = "Funkcionalnost je u izradi";

        let toast = this
            .toastCtrl
            .create({message: message, duration: 3000, position: 'bottom'});

        toast.onDidDismiss(() => {});

        toast.present();
    }

    public presentToastError(message: string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {
            
        });

        toast.present();
    }


    /***favorites begin*/


    /***favorites end*/
}