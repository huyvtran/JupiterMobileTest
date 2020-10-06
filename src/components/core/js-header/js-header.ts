import {NavController, ViewController} from 'ionic-angular';
import {Component, Input} from '@angular/core';
import {GlobalProvider} from '../../../providers/core/global-provider';
import {FavoritesProvider} from '../../../providers/core/favorites-provider';
import {VariableProvider} from '../../../providers/core/variable-provider';


@Component({selector: 'js-header', templateUrl: 'js-header.html'})
export class JsHeaderComponent {

    @Input()title : string = "...";
    @Input()type : string;
    @Input()showFavorite : boolean;
    @Input()showClose : boolean;
    @Input()showSub : boolean = false;
    @Input()rootPage : string;
    @Input()modalPage : boolean;

    forceHideClose : boolean;


    ngAfterViewInit() {
        this.canGoBack = this.navCtrl.canGoBack();
        if (this.showFavorite == true)
        {
            this.favoritesInit();
            this.isFavoriteExists();
        }

        if (this.canGoBack == true && this.modalPage==true) {
            this.forceHideClose = true;
        }

      }

    favoriteExists : boolean = false;
    canGoBack : boolean = false;

    constructor(private navCtrl : NavController, private viewCtrl : ViewController, private variableProvider: VariableProvider, private globalProvider : GlobalProvider, private favoritesProvider : FavoritesProvider) {

    }

    ionViewDidLoad(){

    }


    favoritesInit() {
        this
            .favoritesProvider
            .init();
    }

    addRemoveFavorite() {
        this
            .favoritesProvider
            .addRemoveFavorite(this.getPageName());
        this.isFavoriteExists();
    }

    isFavoriteExists() {
        this.favoriteExists = this
            .favoritesProvider
            .isFavoriteExists(this.getPageName());
    }

    getPageName() : string {
        if (this.rootPage == null)
            return this.viewCtrl.id;
        else
            return this.rootPage;
    }

    goBack() {
        this
            .globalProvider
            .pullPage('');
    }

}
