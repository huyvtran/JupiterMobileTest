// 12032018 - dsenkovic - dodan fokus na input, kad se obriše searchTerm prikazuje sve stavke, dodana poruka ako nema podataka

import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams, ModalController, ToastController, PopoverController } from 'ionic-angular';

import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-mp-zaprimanjeiotpremarobe-listatrgovina',
  templateUrl: 'mp-zaprimanjeiotpremarobe-listatrgovina.html'
})
export class MPZaprimanjeiotpremarobeListatrgovinaPage extends BasePage {
  items: any[] = [];
  itemsoriginal: any[] = [];
  val;
  searchControl: FormControl;
  groups: any = [];
  nemapodataka = false;
  duljinaitems = 0;
  vectrazim = false;
  searchTerm: string = '';
  searching: boolean = false;

  prazno=true;
  item:any={trgovinaid:null, trgovinanaziv:null};

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public toastCtrl: ToastController
            , public popoverCtrl: PopoverController, public storage: Storage) {
    super();
    this.searchControl = new FormControl();

  }

  ionViewDidEnter(){
    let elem = <HTMLInputElement>document.querySelector('.searchbar-input');
    if (elem) { setTimeout(() => { elem.focus(); }, 550); }
  }
  ionViewWillEnter(){
    this.otvori();

    this.searchControl.valueChanges.subscribe(search => {
      this.nemapodataka = false;
      this.items = [];
      this.duljinaitems = this.items.length;
    });
    if(this.searchTerm.trim()==''){
      this.search();
    }
    setTimeout(() => {
      this.searchControl.valueChanges.debounceTime(1000).subscribe(search => {
        if (!this.vectrazim) {
          this.items = [];
          this.duljinaitems = this.items.length;
          this.nemapodataka = false;
          if (this.searchTerm.length > 2 || this.searchTerm.trim()=='') {
            //this.loaddatafromwebservice(); 
            //if(isNaN (+this.searchTerm)){
              this.search();
            //}
            

          }


        }
      });
    }, 500);

    
  
  }

  clearsearch(){
    this.searchTerm = '';
  }

  search() {
    this.vectrazim = true;
    this.nemapodataka = false;
    setTimeout(() => {
      this.vectrazim = false;
    }, 900);
    console.log(this.searchTerm);
    if (this.searchTerm.trim() == '') {
      //this.items = [];
      this.items= this.itemsoriginal;
      this.duljinaitems = this.items.length;
      this.nemapodataka = false;

    }
    else {
      this.items = [];
      this.searching = true;
      console.log('searching', this.searching);
      // if(!isNaN (+this.searchTerm)){
      //   console.log('trazim brojeve');
      //   this.itemsoriginal.forEach(element => {
      //     if (element.Sifra==this.searchTerm.toLowerCase() || element.barcode==this.searchTerm.toLowerCase() ) {
      //       this.items.push(element);
      //     }
  
      //   });

      // }
     // else{
        console.log('trazim nazive');
        
      this.itemsoriginal.forEach(element => {
        if (element.naziv.toLowerCase().match(this.searchTerm.toLowerCase())) {
          this.items.push(element);
        }

      });
    //}


      setTimeout(() => {
        this.searching = false;
        console.log('searching', this.searching)
      }, 300);


      this.duljinaitems = this.items.length;
      console.log('duljinaitems= ', this.duljinaitems);
      if (this.duljinaitems == 0) {
        this.nemapodataka = true;
        //this.searchTerm='';
      }


      console.log('this.items: ', this.items);

      this.duljinaitems = this.items.length;


    }

  }

  otvori(){
    this.getData().then(x => {
      this.items = x.items;
      this.itemsoriginal= x.items;
      this.prazno=false;
        this.nemapodataka = false;
        if (this.items.length == 0) {
          this.nemapodataka = true;
          this.prazno=true;
        }
        else {
          this.nemapodataka = false;
          this.prazno=false;
        }
      });
  }
 

  getData() {
    
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMPUnosDokMobApp",
          "params": {
            "action": 1,
            "operaterid": '@@operateriid'
              
          },
          "tablename": "items"
        }
      ]
    }

    return this.global.getData(dataDef);

  }

  dalje(item){
    this.item.trgovinaid = item.trgovinaid;
    this.item.trgovinanaziv = item.naziv;
    this.navCtrl.push('MPZaprimanjeiotpremarobeVrstadokumentaPage', {
      'trgovinaid': this.item.trgovinaid,
      'trgovinanaziv': this.item.trgovinanaziv
    });
  }



    
  }

