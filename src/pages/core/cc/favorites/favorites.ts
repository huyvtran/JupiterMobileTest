import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';

import {FavoritesProvider} from '../../../../providers/core/favorites-provider';
import {GlobalProvider} from '../../../../providers/core/global-provider';

import _ from 'lodash';

@IonicPage()
@Component({selector: 'page-core-cc-favorites', templateUrl: 'favorites.html'})
export class CoreCcFavoritesPage {
    constructor(public favoritesProvider : FavoritesProvider
        , private globalProvider : GlobalProvider) {}

    openModule(item) {
        this.globalProvider.pushPage(_.replace(item.parameter, "mob:", ""));
    }

    doubleTap() {
        this.closePage();
    }

    closePage() {
        this
            .globalProvider
            .closeCC();
    }

}
