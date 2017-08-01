import {ToastController} from 'ionic-angular';
import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {GlobalProvider} from './global-provider';

@Injectable()
export class FavoritesProvider {
    private storage : Storage;
    public dataFavorites : Array <any> = new Array<any>();

    public dataFavoritesCompany : Array <any> = new Array<any>();

    private currentPageName : string;
    private currentPageTitle : string;
    private currentApplication : string;

    public favoriteExists : boolean = false;

    private favoritesCnt : number = 0;

    constructor(private toastCtrl : ToastController) {
        // this.storage = new Storage([]); this.initStorage();
    }

    init(currentPageName : string, currentPageTitle: string, currentApplication: string) {
        this.currentPageName = currentPageName;
        this.currentPageTitle = currentPageTitle;
        this.currentApplication = currentApplication;
        if (this.storage == null)
            this.storage = new Storage([]);

        this.getDataFromStorage(GlobalProvider.coreStorageKeys.favorites, this.dataFavorites);
    }

    getDataFromStorage(keyStorage, dataStorage) {
        if (this.dataFavorites.length == 0) {
            this
                .storage
                .ready()
                .then(() => {
                    return this
                        .storage
                        .get(keyStorage)
                        .then(val => {
                            let data: any[] = JSON.parse(val);
                            if (data != null) {
                                this.setStorage(data);
                            } else {
                                dataStorage = new Array < any > ();
                            }
                            //return data;
                        })
                        .then(() => {
                            this.setVars();
                        })
                });
        } else {
            this.setVars();
        }
    }

    setVars() {
        this.setFavoritesCompany();
        this.favoriteExists = this.isFavoriteExists(this.currentPageName);
        this.setFavoriteCnt();
    }

    setStorage(data) {
        if (data != null) {
            this.dataFavorites = data;
        }
    }

    setFavoriteCnt() {
        if (this.dataFavorites.length > 0) {
            let data = this.dataFavorites.filter(x => x.db == GlobalProvider.company.db);
            if (data != null)
                this.favoritesCnt = data.length;
            else 
                this.favoritesCnt = 0;
        } else {
            this.favoritesCnt = 0;
        }
    }

    setFavoritesCompany() {
            this.dataFavoritesCompany = this.dataFavorites.filter(x => x.db == GlobalProvider.company.db);    
    }

    //main handler
    addRemoveFavorite() {
        let item = this.filterData(this.dataFavorites, this.currentPageName);
        if (item.length == 0) {
            this
                .dataFavorites
                .push({title: this.currentPageTitle, page: this.currentPageName, application: this.currentApplication, db: GlobalProvider.company.db});
        } else {
            this
                .dataFavorites
                .splice(item, 1);
        }
        this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .set(GlobalProvider.coreStorageKeys.favorites, JSON.stringify(this.dataFavorites));
            })
        this.isFavoriteExists(this.currentPageName);
        this.setFavoritesCompany();
        this.setFavoriteCnt();
        this.presentToast();
    }

    filterData(data, value) : any {
        return data.filter(x => x.page == value && x.db == GlobalProvider.company.db);
    }

    isFavoriteExists(page) : boolean {
        if(this.filterData(this.dataFavorites, page).length == 0) 
            this.favoriteExists = false;
        else 
            this.favoriteExists = true;
        
        console.log(this.favoriteExists);
        return this.favoriteExists;

    }

    presentToast() {

        let message : string
        if (this.favoriteExists == true) 
            message = "Granula je dodana u favorite";
        else 
            message = "Granula je uklonjena iz favorita";
        
        let toast = this
            .toastCtrl
            .create({message: message, duration: 3000, position: 'bottom'});

        toast.onDidDismiss(() => {
            console.log('Dismissed toast');
        });

        toast.present();
    }

}