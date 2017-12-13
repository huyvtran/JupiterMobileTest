import { Component, ViewChild } from '@angular/core';
import { Content, NavController, IonicPage, NavParams, ViewController, PopoverController } from 'ionic-angular';

import { BasePage } from '../../../../providers/base/base-page';
import * as ICore from '../../../../interfaces/iCore';

import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-konsolidacija-trazilica',
  templateUrl: 'trazilica.html'
})



export class CRMKonsolidacijaTrazilicaPage extends BasePage {

  @ViewChild(Content) content: Content;

  items: any = {};
  item: any = {};
  val = '';
  searchControl: FormControl;
  action;
  naslov;
  klmasterrobaid;
  parametriupita: any = {};
  scrollid;
  lenght:number =0;
  rc:number=0;
  povijest:any[]=[];
  akcija:any[]=[{action:0}];
  prviput=true;
  trazimizhistorija=false;
  usaougetdata=false;
  counterizabranih=0;

  trazilicatype='flat-single';
  //trazilicatype='flat-multiselect';
  //trazilicatype='hierachy-single';
  //trazilicatype='hierachy-multiselect';

  currentsortkeylevel=2;
  currentsortkey='';


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public storage: Storage, public popoverCtrl: PopoverController) {
    super();
    this.searchControl = new FormControl();
    // this.parametriupita.skladisteid=this.navParams.get('skladisteid');
    // this.parametriupita.robaid=this.navParams.get('robaid');
    // this.parametriupita.klmasterrobaid=this.navParams.get('klmasterrobaid');
    // this.parametriupita.cjenikid=this.navParams.get('cjenikid');
    // this.parametriupita.partneriid=this.navParams.get('partneriid');
    // this.action=this.navParams.get('action');
    this.parametriupita = this.navParams.data;
    //console.log('this.parametriupita ',this.parametriupita);
    this.trazilicatype = this.parametriupita.trazilicatype || 'flat-single';
    
    console.log('parametri došli u tražilicu: ',this.parametriupita);
    this.action = this.parametriupita.action;
    this.storage.get('jm_crm_povijest_' + this.action).then(data => {
      if (data) {
        this.povijest = data;
        
        console.log('povijest u popoveru: ', this.povijest);
      }
    }); 
    

  

    console.log('action u konstruktoru', this.action);
    if(this.action == 4){
      this.naslov = 'Tražilica organizacijskih shema';
      this.scrollid = this.parametriupita.orgshema;
    }
    else if (this.action == 6) {
      this.naslov = 'Tražilica skladišta';
      this.scrollid = this.parametriupita.skladisteid;
    }
    else if (this.action == 10){
      this.naslov= 'Tražilica lokacija partnera';
      this.scrollid = this.parametriupita.lokacijaid;
    }

    else if (this.action == 11) {
      this.naslov = "Tražilica klase robe";
      this.scrollid = this.parametriupita.klmasterrobaid;
    }
    else if (this.action == 8) {
      this.naslov = "Tražilica robe";
      this.scrollid = this.parametriupita.robaid;
    }
    else if (this.action == 7) {
      this.naslov = "Tražilica partnera";
      this.scrollid = this.parametriupita.partneriid;
    }
    else if (this.action == 12) {
      this.naslov = "Vrsta cjenika";
      this.scrollid = this.parametriupita.cjenikid;
    }
    else if (this.action == 13) {
      this.naslov = "Odabir ugovora";
      this.scrollid = this.parametriupita.KupUgovoriVrsteId;
      //this.lenght = this.items.length;
    }
    else if (this.action == 55) {
      this.naslov = "Osobe kod nas";
      this.scrollid = this.parametriupita.osobeid;
    }
    else if (this.action == 555) {
      this.naslov = "Osobe kod partnera";
      this.scrollid = this.parametriupita.osobeparid;
    }
    else if (this.action == 14) {
      this.naslov = "Vrste kontakta";
      this.scrollid = this.parametriupita.parkontaktvrstaid;
    }


    console.log('Action iz filter-forme: ', this.action);

  }

  ionViewDidLoad() {
    if(this.prviput==true){
      this.prviput=false;
    
    
    if (this.action == 8 && this.parametriupita.klmasterrobaid != null) {
      this.trazi(1);
    }
    else {
      if(this.action==10){
        this.trazi(0);
      }
      else{
        if(this.action!=555){
      
      this.storage.get('jm_crm_' + this.action).then(val => {
        if (val) {
          console.log('val',val);
          this.lenght=val.items.length;
          console.log('this.lenght',this.lenght);
          if (this.lenght > 0){
          this.rc = val.items[0].rc;
          let tempsortkey = val.items[0].sortkey || '';
          console.log('tempsortkey',tempsortkey);
          if (tempsortkey != '') { this.trazilicatype = 'hierachy-single' }
          console.log('this.trazilicatype local ', this.trazilicatype);
          }
          this.items = val;
          console.log('listapartnera: ', this.items);
          setTimeout(() => {
            console.log('this.scrollid local', this.scrollid);
            this.scrollTo("item" + (this.scrollid || 0));
          }, 200);
        }
        else {
          this.trazi(0);
        }
      
      });
    

      this.storage.get('jm_crm_val_' + this.action).then(val => {
        if (val) {
          this.val = val;
          console.log('val: ', this.val);
        }
        else {
          this.val = '';
        }
      });
    }
    else{
      this.trazi(0);
      
    } 
  }
  }
}
else{
  console.log('nije prvi put u pageu!');
}
    
  setTimeout(() => {
    this.searchControl.valueChanges.debounceTime(1000).subscribe(search => {
      if (! this.trazimizhistorija) {
       
      if (this.val.length > 2) { this.trazilica(0,1); }
      }
    });
  
  }, 500);
  

  
}


  getStyle(item) {
    if(item.id==this.scrollid) {
      return "#f4f4f4";
    } else {
      return "";
    }
 }
 getStyle2(item) {
  if(item.id==this.scrollid) {
    return "#488aff";
  } else {
    return "";
  }
}


  scrollTo(element: string) {

    try {
      let elem = document.getElementById(element);
      var box = elem.getBoundingClientRect();
      var body = document.body;
      var docEl = document.documentElement;

      var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
      var clientTop = docEl.clientTop || body.clientTop || 0;
      var top = box.top + scrollTop - clientTop;
      var cDim = this.content.getContentDimensions();

      var scrollOffset = Math.round(top) + cDim.scrollTop - cDim.contentTop - 300;

      this.content.scrollTo(0, scrollOffset, 500);

    } catch (error) {

    }



  }

  getData() {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMOB_trazilice",
          "params": {
            "action": this.action,
            "naziv": this.val,
            "klmasterrobaid": this.parametriupita.klmasterrobaid,
            "id":this.parametriupita.partneriid
            

          },
          "tablename": "items"

        }
      ]
    }

    return this.global.getData(dataDef, true);
    
  }

  clearsearch(){
    this.val = '';
    this.trazi(0);
  }

trazi(sOdabranomKlasomIdemoPoRobu){
  if (this.usaougetdata==false) {
    this.usaougetdata=true;
  this.getData().then(x => {
   
    setTimeout(() => {
      this.usaougetdata=false;
    }, 1100);
    
    this.rc=0;
    this.currentsortkeylevel=2;
    this.currentsortkey='';
    try {
      this.lenght=x.items.length;
      console.log('this.lenght ', this.lenght);
      
      if (this.lenght > 0){
      this.rc=x.items[0].rc;
      let tempsortkey = x.items[0].sortkey || '';
      if (tempsortkey != '') { this.trazilicatype = 'hierachy-single'}
      console.log('this.trazilicatype 0', this.trazilicatype);
      console.log('this.currentsortkey 0', this.currentsortkey);
      console.log('this.currentsortkeylevel 0', this.currentsortkeylevel);
      setTimeout(() => {
        console.log('this.scrollid 0', this.scrollid);
        this.scrollTo("item" + (this.scrollid || 0));
      }, 200);
      }

      this.items = x;
      console.log('this.items ', this.items);
      
      if(sOdabranomKlasomIdemoPoRobu>0){
        setTimeout(() => {
          this.scrollTo("item" + (this.scrollid || 0));
        }, 200);
      }
      
    } catch (error) {
      console.log('error ', error);
    }
      
      
    
    });
  }
}
  

  trazilica(sOdabranomKlasomIdemoPoRobu, myEvent) {
    if (this.usaougetdata==false) {
      this.usaougetdata=true;
      

    if(myEvent!=0){
      if(this.val.trim().length>2){
        this.rc=0;
        this.currentsortkeylevel=2;
        this.currentsortkey='';

    this.getData().then(x => {
      setTimeout(() => {
        this.usaougetdata=false;
      }, 1100);
      
      try {
        this.lenght=x.items.length;
        if (this.lenght > 0){
        this.rc=x.items[0].rc;
        let tempsortkey = x.items[0].sortkey || '';
        if (tempsortkey != '') { this.trazilicatype = 'hierachy-single'}
        console.log('this.trazilicatype 1', this.trazilicatype);
        setTimeout(() => {
          this.scrollTo("item" + (this.scrollid || 0));
        }, 200);
        }

        this.items = x;
        console.log('this.items ', this.items);
        
        if(sOdabranomKlasomIdemoPoRobu>0){
          setTimeout(() => {
            this.scrollTo("item" + (this.scrollid || 0));
          }, 200);
        }
      } catch (error) {
        
      }
      
      

    });

      }
      else{
        this.usaougetdata=false;
        console.log('val je kraći od 3 znaka, ne traži ništa!');
      }
    }
    else{
    
    this.getData().then(x => {
      this.currentsortkeylevel=2;
      this.currentsortkey='';
      this.rc=0;
      setTimeout(() => {
        this.usaougetdata=false;
      }, 1100);
     try {
      this.lenght=x.items.length;
      if (this.lenght > 0){
      this.rc=x.items[0].rc;
      let tempsortkey = x.items[0].sortkey || '';
      if (tempsortkey != '') { this.trazilicatype = 'hierachy-single'}
      console.log('this.trazilicatype 2', this.trazilicatype);
      setTimeout(() => {
        this.scrollTo("item" + (this.scrollid || 0));
      }, 200);
      }

      this.items = x;
      console.log('this.items ', this.items);
     
      
      if(sOdabranomKlasomIdemoPoRobu>0){
        setTimeout(() => {
          this.scrollTo("item" + (this.scrollid || 0));
        }, 200);
      }
     } catch (error) {
       
     }
      

    });
  }

    }
  }

  spremiRezultateTrazenja() {
    if(this.action==10||this.action==555){
      console.log('lokacije ne spremamo u storage!');
    }
    else{
    this.storage.set('jm_crm_' + this.action, this.items);
    this.storage.set('jm_crm_val_' + this.action, this.val);
    let i=0;
    console.log('this.povijest1: ', this.povijest);
    this.povijest.forEach(element => {
      
      if(element==this.val.trim()){
        this.povijest.splice(i,1);
        console.log('element==this.val.trim()', element, this.val.trim());
        console.log('this.povijest2: ', this.povijest);
      }
      i++;
      
    });
    
    if(this.val.trim()!=''){
      console.log('this.povijest3: ', this.povijest);
      
      this.povijest.unshift(this.val.trim());
      console.log('this.povijest4: ', this.povijest);
    if(this.povijest.length>10){
      this.povijest.length=10;
    }
    console.log('this.povijest5: ',this.povijest);
    //this.povijest = [];
    this.storage.set('jm_crm_povijest_' + this.action, this.povijest);
    
    }
  }

  }

  prikazipovijest(myEvent){
    console.log('prikazi povijest klik');
    this.akcija['action']=this.action;
    let popover = this.popoverCtrl.create('PopoverPovijestPage', this.akcija);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if(data!='' && data!=undefined){
        //this.debouncetime=100;
        this.trazimizhistorija = true;
      this.val=data;
      // pozvati servis s parametrom val !
      this.trazilica(0, 0);
      //this.debouncetime=1000;

      setTimeout(() => {
        this.trazimizhistorija = false;
      }, 1200);

      

      }
    });
  }
  
  odaberi(item) {
    console.log('odaberi',item);
    this.item=item;
    this.spremiRezultateTrazenja();
    item.action = this.action;
    this.viewCtrl.dismiss(item);
  }


  oznaci(item) {
    console.log('oznaci',item);
    this.counterizabranih++;
  }


  drilldown(item) {
    console.log('drilldown',item);
    this.currentsortkey = item.sortkey;
    this.currentsortkeylevel = this.currentsortkeylevel + 2;
    console.log('currentsortkeylevel',this.currentsortkeylevel);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  swipeEvent(item,e) {

    console.log('swipeEvent',item);
    

    // https://stackoverflow.com/questions/36970425/determine-whether-a-swipe-event-is-for-a-left-swipe-or-a-right-swipe
    if (e.direction == 2) {
        //direction 2 = right to left swipe.
        this.currentsortkeylevel = this.currentsortkeylevel + 2;
        console.log('currentsortkeylevel',this.currentsortkeylevel);
    }

    if (e.direction == 4) {
      //direction 4 = LEFT to RIGHT swipe.
      if (this.currentsortkeylevel>2) {
        this.currentsortkeylevel = this.currentsortkeylevel - 2;
        console.log('currentsortkeylevel',this.currentsortkeylevel);
      }
  }

  this.currentsortkey = item.sortkey.substr(0,this.currentsortkeylevel-2)
  console.log('currentsortkey',this.currentsortkey);

}

}
