import { Component} from '@angular/core';
import { ViewController, IonicPage } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

import {BasePage} from '../../../../../providers/base/base-page';

import {TerkomSifarniciProvider} from '../../../../../providers/modules/terkom/terkom-sifarnici-provider';
import {TerkomNarudzbaProvider} from '../../../../../providers/modules/terkom/terkom-narudzba-provider';


/*
  Generated class for the NarudzbaZaglavljeEdit page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-narudzba-zaglavlje-edit',
  templateUrl: 'narudzba-zaglavlje-edit.html'
})
export class TerkomNarudzbaZaglavljeEditPage  extends BasePage{

  //datum = new Date();
  form: FormGroup;
  submitAttempt: boolean = false;
	narudzba: any = [];
	razlogpovrata: any;
	datumdok : Date;
  razlogpovrataid : Array<string> = null;
  //multirazlogPovrata:boolean;
	constructor(public narudzbeService: TerkomNarudzbaProvider, public viewCtrl: ViewController,
		public formBuilder: FormBuilder, public sifarniciService: TerkomSifarniciProvider) {

		super()

  	this.form = formBuilder.group({
        opis: [narudzbeService.narudzba.opis ? narudzbeService.narudzba.opis : '', Validators.maxLength(100)],
        nacinPlacanja: [narudzbeService.narudzba.nacinplacanjaid],
        nacinIsporuke: [narudzbeService.narudzba.nacinisporukeid],
				skladista: [narudzbeService.narudzba.skladisteid],
				datum: [narudzbeService.narudzba.datumdok],
				razlogpovrata : [narudzbeService.narudzba.razlogpovrataid]
    });
		this.razlogpovrataid = narudzbeService.narudzba.razlogpovrataid
  }


  ionViewWillEnter() {
		//this.tabBarElement.style.display = 'none';
		//console.log("zag details")
		//this.sifarniciService.loadNacinIsporuke();
		this.sifarniciService.loadRazlogPovrata()
		.then((res) => {
			this.razlogpovrata = res;
			//console.log(this.razlogpovrata);
			//console.log(this.razlogpovrata)
			this.sifarniciService.loadNacinPlacanja(this.narudzbeService.narudzba.vrstadokid)
    })

    // console.log('multri razlog povrata iz providera je', this.sifarniciService.multiRazlogPovrata);

    // if(this.sifarniciService.multiRazlogPovrata == 0)
    // {
    //   this.multirazlogPovrata = false;
    // }
    // else if (this.sifarniciService.multiRazlogPovrata == 1 )
    // {
    //   this.multirazlogPovrata = true;
    // }

		//console.log(this.narudzbeService.narudzba.razlogpovrataid);
	}

  ionViewDidLoad() {
    //console.log('ionViewDidLoad NarudzbaZaglavljeEditPage');
  }

	onCancel(){

		this.form.value.razlogpovrata = null;
		//this.narudzbeService.narudzba.razlogpovrataid = null;
		this.razlogpovrataid = null;

	}
  save(){

	    this.submitAttempt = true;

	    if(!this.form.valid){
	        console.log("nije validna");
	    }
	    else {
	        console.log("success!")

	        this.narudzba.opis = this.form.value.opis ? this.form.value.opis : null;
	        this.narudzba.nacinisporukeid = parseInt(this.form.value.nacinIsporuke);
	        this.narudzba.nacinplacanjaid = parseInt(this.form.value.nacinPlacanja);
	        this.narudzba.datumdok = this.form.value.datum;
					this.narudzba.skladisteid = parseInt(this.form.value.skladista)
					//this.narudzba.razlogpovrataid = this.razlogpovrataid ? this.razlogpovrataid : null;

					if (this.razlogpovrataid)
					{	
						if(! Array.isArray(this.razlogpovrataid) ){
							this.razlogpovrataid = [this.razlogpovrataid];
						  }
						  this.narudzba.razlogpovrataid = this.razlogpovrataid;
					}
					else
					{
						this.narudzba.razlogpovrataid = null;
					}

	        //console.log(this.narudzba);
	        this.narudzbeService.update(this.narudzba,this.narudzbeService.NarudzbaID)
	        .then((res) => {
	        	//vrati nazad i refresh narudzbe
	        	this.narudzbeService.getNarudzba(this.narudzbeService.NarudzbaID)
	        	.then((res) =>{ this.viewCtrl.dismiss(); })
	        }).catch((err) => this.global.logError(err, false))
	    }

	}


	canceledNacinPlacanja(){
		console.log("cancel nacin placanja")
	}

	canceledNacinIsporuke(){
		console.log("cancel nacin isporuke")
	}


 	dismiss(){
    	console.log("dismiss");
  		this.viewCtrl.dismiss();
  	}

}
