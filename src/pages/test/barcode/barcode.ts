import { Component} from '@angular/core';
import { IonicPage, Platform, App } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

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
    public platform: Platform) {
        
    }
  scan() {
        this.platform.ready().then(() => {
            this.barcodeScanner.scan().then((barcodeData) => {
                  if (barcodeData.cancelled) {
                    return false;
                  }
                  this.barcodes.push({name:'nedefinirano', barcode: barcodeData.text, format: barcodeData.format});
                }, (err) => {
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
