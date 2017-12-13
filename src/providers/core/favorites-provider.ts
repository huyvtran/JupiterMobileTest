import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

import {ConstProvider} from './const-provider';
import {VariableProvider} from './variable-provider';
import {ModulesProvider} from './modules-provider';

import * as ICore from '../../interfaces/core/favorites';
import {HelpersProvider} from './helpers-provider';

@Injectable()
export class FavoritesProvider {
    private storage : Storage;
    public dataFavorites : Array <ICore.IFavorites> = new Array<ICore.IFavorites>();

    public dataFavoritesCompany : Array<ICore.IFavorites> = new Array<ICore.IFavorites>();
    
    private favoritesCnt : number = 0;
    private initialized: boolean = false;

    //@ViewChild(GlobalProvider) globalProfile: GlobalProvider
    constructor(private constProvider: ConstProvider
        , private variableProvider: VariableProvider
        , private modulesProvider: ModulesProvider
        , private helpers: HelpersProvider) {
        // this.storage = new Storage([]); this.initStorage();
    }

    init() {
        if (this.storage == null)
            this.storage = new Storage([]);

        if (this.initialized == false) {
            this.initialized=true;
            this.getDataFromStorage(this.constProvider.coreStorageKeys.favorites, this.dataFavorites);
        }
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
                            let data: Array<ICore.IFavorites> = JSON.parse(val);
                            if (data != null) {
                                this.dataFavorites = data;
                            } else {
                                dataStorage = new Array<ICore.IFavorites> ();
                            }                            
                        })
                        .then(() => {
                            this.setFavoritesCompany();
                        })
                });
        } else {
            this.setFavoritesCompany();
        }
    }

    setFavoritesCompany() {
        this.dataFavoritesCompany = [];
        //this.dataFavorites;
        let dataC = this.dataFavorites.filter(x => x.db.trim() == this.variableProvider.company.db.trim());
        dataC.forEach(x => {
                let item = this.modulesProvider.sveGranule.find(y => {
                     return y.parameter == x.page
                    }
                );
                if (item != null)
                    this.dataFavoritesCompany.push(item);
            });   

        this.favoritesCnt = dataC.length;
        
    }

    

    //main handler
    addRemoveFavorite(pageName) {
        let isPushed: boolean = false;
        let itemIndex = this.findIndex(pageName);
        if (itemIndex < 0) {
            isPushed = true;
            this
                .dataFavorites
                .push({page: pageName, db: this.variableProvider.company.db, time: new Date()});
        } else {
            this
                .dataFavorites
                .splice(itemIndex, 1);
        }
        this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .set(this.constProvider.coreStorageKeys.favorites, JSON.stringify(this.dataFavorites));
            })
        this.setFavoritesCompany();
        this.presentToast(isPushed);
    }

    findIndex(pageName): number {
        return this.dataFavorites.findIndex(x => x.page == pageName  && x.db.trim() == this.variableProvider.company.db.trim());
    }

    isFavoriteExists(pageName) : boolean {
        if(this.findIndex(pageName) < 0) 
            return false;
        else 
            return true;
    }

    presentToast(isPushed: boolean) {
        let message : string
        if (isPushed == true) 
            message = "Granula je dodana u favorite";
        else 
            message = "Granula je uklonjena iz favorita";
        this.helpers.presentToast(message, null, 3000);
    }

}