import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';

import {FavoritesProvider} from '../../../../providers/core/favorites-provider';

// import { AboutPage } from '../about/about'; import { HomePage } from
// '../home/home';

@IonicPage()
@Component({templateUrl: 'tabs.html'})
export class CoreCcTabsPage {
    tab1Root = 'CoreCcApplicationsPage';
    tab2Root = 'CoreCcFavoritesPage';
    tab3Root = 'CoreCcProfilPage';
    tab4Root = 'CoreCcToolsPage';
    tab5Root = 'CoreCcSettingsPage';

    constructor(private favoritesProvider : FavoritesProvider) {
        favoritesProvider.init("", "", "");
    }
}
