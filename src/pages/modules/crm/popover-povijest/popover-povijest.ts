import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';


/**
 * Generated class for the PopoverPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-povijest',
  templateUrl: 'popover-povijest.html',
})
export class PopoverPovijestPage {

  povijest: any[] = [];
  action;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public storage: Storage) {

    this.action=this.navParams.get('action');
   

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
    
    this.storage.get('jm_crm_povijest_' + this.action).then(data => {
      if (data) {
        this.povijest = data;
        
        console.log('povijest u popoveru: ', this.povijest);
      }
    });
   
  }


  trazi(item){

    this.viewCtrl.dismiss(item);

  }

  
}
