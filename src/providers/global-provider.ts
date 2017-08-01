import {Injectable} from '@angular/core';
import {App, ToastController} from 'ionic-angular';
import {ModulesProvider} from './modules-provider';
import {Storage} from '@ionic/storage';

@Injectable()
export class GlobalProvider {
    public static version : string = "9.0.1";

    public static pagesHistory : Array < string > = new Array < string > ();

    //public static jupiterServerPath = "http://localhost:25509/api/";
    public static jupiterServerPath = "http://213.202.75.122:30080/spinmobile/api/";
    //public static jupiterServerPath = "http://213.202.75.122:30080/spinmobiledev/api/";

    public static coreStorageKeys : {
        jupiterSystemData: string,
        loginData: string,
        company: string,
        modules: string,
        favorites: string
    } = {
        jupiterSystemData: "core.jupiterSystemData.001",
        company: "core.company.001",
        loginData: "core.loginData.001",
        modules: "core.modules.001",
        favorites: "core.favorites.001"
    };

    public static serverPath : string = "";
    public static refreshToken : string = "";
    public static accessToken : string = "";
    public static pushRegistrationId: string = "";


    public static device: any;
    // public static deviceId: string = "";
    // public static deviceModel: string = "";
    // public static devicePlatform: string = "";
    // public static deviceVersion: string = "";
    // public static deviceManufacturer: string = "";
    // public static deviceIsVirtual: string = "";
    // public static deviceSerial: string = "";

    public static loginData : any = [];
    public static jupiterSystemData : any = [];
    public static company : any = [];
    


    constructor(public modulesProvider : ModulesProvider, public app : App, private storage : Storage, public toastCtrl : ToastController) {
    }

    // //vraća trenutnu stranicu getActivePage(navCtrl : NavController) : string {
    //   return navCtrl         .getActive()         .name; }

    public getApplicationName() : string {return this.modulesProvider.applicationName;}

    public getSubTitle() : string {
        let companyName = "" //GlobalProvider.company.name;
        let userName = "";

        if (GlobalProvider.company != null && GlobalProvider.company.name != null) 
            companyName = GlobalProvider.company.name;
        
        if (GlobalProvider.jupiterSystemData != null && GlobalProvider.jupiterSystemData.user != null && GlobalProvider.jupiterSystemData.user.name != null) 
            userName = GlobalProvider.jupiterSystemData.user.name;
        
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

    public pullPage() {
        //ukloni zadnji zapis
        GlobalProvider
            .pagesHistory
            .pop();
        //zadnji (predzadnji) zapis
        var page = GlobalProvider.pagesHistory[GlobalProvider.pagesHistory.length - 1];
        console.log(page);

        this
            .app
            .getRootNav()
            .setRoot(page, {}, {
                animate: true,
                direction: 'backward'
            })
    }

    public static pushPage(page : string) {
        GlobalProvider
            .pagesHistory
            .push(page);
    }

    public closeCC() {
        this
            .storage
            .remove(GlobalProvider.coreStorageKeys.company);
        this.modulesProvider.ClearData();
        GlobalProvider.company = null;

        this.pullPage();
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

}