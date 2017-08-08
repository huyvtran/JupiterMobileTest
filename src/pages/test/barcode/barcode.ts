import { Component} from '@angular/core';
import { IonicPage, Platform, App } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { GlobalProvider } from '../../../providers/core/global-provider';
import { FavoritesProvider } from '../../../providers/core/favorites-provider';

/*
  Generated class for the Barcode page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-test-barcode',
  templateUrl: 'barcode.html'
})
export class TestBarcodePage {

public barcodes : Array < {
        name: string,
        barcode: string,
        format: string
    } > = new Array < {
        name: string,
        barcode: string,
        format: string
    } >();

  constructor(private barcodeScanner: BarcodeScanner, private app: App,
    public platform: Platform, private favoritesProvider: FavoritesProvider, private globalProvider: GlobalProvider) {
        this.init();
    }



    private init() {
        Promise
        .resolve()
        .then(() => {
            return this.favoritesProvider.init("TestBarcodePage", "Barcode scanner", "MERCUR - Trading System");
        });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BarcodePage');
  }

  scan() {
        this.platform.ready().then(() => {
            this.barcodeScanner.scan().then((barcodeData) => {
                  if (barcodeData.cancelled) {
                    console.log("false");
                    return false;
                  }
                  this.barcodes.push({name:'nedefinirano', barcode: barcodeData.text, format: barcodeData.format});
                }, (err) => {
                  console.log(err);
            });
        });
    }

    goBack() {
        this
            .app
            .getRootNav()
            .setRoot('CoreCcTabsPage', {}, {
                animate: true,
                direction: 'backward'
            });
    }

    delete(i) {
      this.barcodes.splice(i, 1);
    }

}
