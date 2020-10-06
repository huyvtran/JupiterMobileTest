import { Component, ViewChild } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import * as ICore from '../../../../../interfaces/iCore';
import { BasePage } from '../../../../../providers/base/base-page';


/**
 * Generated class for the SignaturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage extends BasePage {
  @ViewChild(SignaturePad) signaturePad: SignaturePad;

  signatureImage: string;
  data: any;
  //signaturePadOptions: Object = {}
  private signaturePadOptions: Object = { // Check out https://github.com/szimek/signature_pad
    'minWidth': 1,
    'canvasWidth': 500,
    'canvasHeight': 300,
    'penColor': '#364b5e'
  };

  constructor(public navParams: NavParams, private viewCtrl : ViewController) {
    super();
    this.data = this.navParams.get("data");
    console.log(this.data)
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('canvasWidth', canvas.offsetWidth)
    this.signaturePad.set('canvasHeight', canvas.offsetHeight)
  }


  ngAfterViewInit() {

    this.signaturePad.resizeCanvas();
    //this.canvasResize();
  }

  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    console.log(this.signatureImage)

    var potpis = this.signatureImage.split(',')[1];
    //let blob = this.b64toBlob(data, 'image/png');

    //let byteArray = this.b64toByteArray(data);

    


    this.sendPotpis(potpis).then((res) => {
      console.log("spremljeno!")
      this.viewCtrl.dismiss(res);
    })
    .catch((err) => {
      this.global.logError(err, true)
    })

  }

  sendPotpis(potpis) {

    let properties: ICore.IPropertiesCore = {
      customApiEndPoint: "potpis"
    }


    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobDigitalniPotpis",
          "params": {
            "dokumentId": this.data.id,
            "tablica" : this.data.tablename,
            "potpis": potpis
          }
        }
      ]
    }
    return this.global.getData(dataDef, properties);

  }


  drawClear() {
    this.signaturePad.clear();
  }

  drawCancel() {
    this.viewCtrl.dismiss();
  }

}
