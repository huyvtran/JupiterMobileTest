import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { BasePage } from '../../../../../providers/base/base-page';
import { UtilityIzvidnikProvider } from '../../../../../providers/modules/utility/izvidnik/utility-izvidnik-provider';
import { ConstSharedProvider } from '../../../../../providers/shared/shared-provider';
import { HelpersProvider } from '../../../../../providers/core/helpers-provider';
/**
 * Generated class for the UnosIzvidaPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-unos-izvida',
  templateUrl: 'unos-izvida.html',
})
export class UnosIzvidaPage extends BasePage {

  sorte:any = []
  kulture:any = []

  sorteid:any
  kultureid:any

  datum:any = new Date().toISOString();

  bolestind:any
  bolestopis:string
  stetniciind:any
  stetniciopis:string
  korovopis:string
  vodaopis:string
  ph:number
  vodaind:any
  korovind:any
  phInd:any
  sljedeciMonitoring:number
  preporuka:string

  sklop:string
  zapazanja:string

  parametri:any

  latitude:number
  longitude:number

  UUID:any

  constructor(public navCtrl: NavController, private modalCtrl: ModalController, public navParams: NavParams, 
              private izvidnikProvider:UtilityIzvidnikProvider, private helpersProvider:HelpersProvider, private alertCtrl : AlertController,
              private cdRef: ChangeDetectorRef) {
    super()
    
    this.parametri = this.izvidnikProvider.parametriIzv
  }

  ionViewWillEnter() {
    this.izvidnikProvider.getIzvidnikGeoLocation()
    this.kultureid = this.izvidnikProvider.planSjetve.KultureId;
    this.sorteid = this.izvidnikProvider.planSjetve.SorteId;
  }
  ionViewDidLoad() {

    this.getComboValues()
    this.UUID = this.generateUUID()

    console.log('UUID: ' + this.UUID)
  }

  getComboValues(){

    this.izvidnikProvider.getComboValues().then(res=>{

      this.kulture = res.kulture
      this.sorte = res.sorte

    })

  }

  onSelectChange(selectedValue: any) {
    if (this.kultureid != null) {
      this.getSorteById(selectedValue);
    }
    
  }


  getSorteById(kultureid:number){

    this.izvidnikProvider.getComboSorteById(kultureid).then(res=>{

      this.sorte = res.sorte

    })

  }

  insert(){

    let insertObject = 
    {
      operateriid: "@@operaterid",
      vrijeme:this.datum,
      ratarkodid: this.parametri.ID,
      kultureid:this.kultureid,
      sorteid:this.sorteid,
      napomena:this.zapazanja,
      ratTipIzvidaId:0,  // ovo treba provjeriti odakle taj broj vraca profiler
      latitude:Number(this.latitude),
      longitude:Number(this.longitude),
      bolestind:this.booleanToNumber(this.bolestind),
      bolestopis:this.bolestopis,
      stetniciind:this.booleanToNumber(this.stetniciind),
      stetniciopis:this.stetniciopis,
      korovind:this.booleanToNumber(this.korovind),
      korovopis:this.korovopis,
      vodaind:this.booleanToNumber(this.vodaind),
      vodaopis:this.vodaopis,
      UUID: this.UUID,
      sklop:this.sklop,
      phInd:this.booleanToNumber(this.phInd),
      ph:this.ph,
      sljedeciMonitoring: this.sljedeciMonitoring,
      preporuka: this.preporuka

    }

    this.izvidnikProvider.insertData(insertObject).then(sucess=>{

      for (let i=0; i<this.izvidnikProvider.base64Image.length; i++){

        this.izvidnikProvider.insertSlika(this.UUID, this.izvidnikProvider.base64Image[i]).then(sucess=>{
          console.log(sucess);
        })
      }
      
      this.helpersProvider.presentToast('Događaj uspješno spremljen.', null, 3000, false)
      this.izvidnikProvider.base64Image.splice(0,this.izvidnikProvider.base64Image.length)
      this.navCtrl.pop()
    })
  }

  otvoriTrazilicu(){
    this.navCtrl.push('IzvidnikArkodiPage')
  }


  booleanToNumber(value:any){

    let convertedValue

    if (value ==  true || value !=null){
      convertedValue = 1
    } 
    else {
      convertedValue = 0
    }

    return convertedValue
  }

  snapPicture(){
      
    this.izvidnikProvider.checkPermissions();
    
  }

  dohvatiLokaciju(){
    this.izvidnikProvider.getIzvidnikGeoLocation().then(res1 => {

      this.latitude = res1.coords.latitude
      this.longitude = res1.coords.longitude
      console.log(this.latitude)
      console.log(this.longitude)

    }).then(res2 =>{

      this.izvidnikProvider.getArkod(this.latitude, this.longitude).then(res => {

        console.log(res);

        if (res.arkod.length > 0){
        this.parametri.ID = res.arkod[0].id
        this.parametri.Naziv = res.arkod[0].homename
        this.parametri.Oznaka = res.arkod[0].oznaka
        this.parametri.Povrsina = res.arkod[0].povrsina
  
        this.izvidnikProvider.parametriIzv.ID = res.arkod[0].ratarkodid;
        this.izvidnikProvider.parametriIzv.Naziv = res.arkod[0].homename;
        this.izvidnikProvider.parametriIzv.Oznaka = res.arkod[0].oznaka;
        this.izvidnikProvider.parametriIzv.Povrsina = res.arkod[0].povrsina;

        this.izvidnikProvider.getPlanSjetve(this.parametri.ID).then( res3 => {

          this.kultureid = res3.plansjetve[0].kultureid;
          this.sorteid = res3.plansjetve[0].sorteid;

        })

        }
        
        // ako na zadanim koordinatama ne postoji arkod, očisti objekt parametri
        else if (res.arkod.length == 0) {
  
          this.helpersProvider.presentToast('U bazi nije definiran arkod za trenutnu lokaciju (' + this.latitude.toFixed(5) + '; ' + this.longitude.toFixed(5) + '). Probajte koristiti tražilicu.', null, 3000, false)
  
          this.parametri.ID = null;
          this.parametri.Naziv = null;
          this.parametri.Oznaka = null;
          this.parametri.Povrsina = null;

          this.izvidnikProvider.parametriIzv.ID = null;
          this.izvidnikProvider.parametriIzv.Naziv = null;
          this.izvidnikProvider.parametriIzv.Oznaka = null;
          this.izvidnikProvider.parametriIzv.Povrsina = null;
  
        }
  
      })
    })
    
    console.log('latitude: ' + this.latitude + ' longitude: '+ this.longitude)

  }

  removeImage(selectedImage:number){

    let alert = this
    .alertCtrl
    .create({
        message: 'Potvrdite brisanje slike...',
        buttons: [
            {
                text: 'Odustani',
                role: 'cancel',
                handler: () => {
                }
            }, {
                text: 'Potvrdi',
                handler: () => {
                    
                    this.izvidnikProvider.base64Image.splice(selectedImage,1);
                    this.izvidnikProvider.presentToast('Fotografija obrisana.')                }
            }
        ]
    });
    alert.present();


  }


  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getCaption() {
    if (this.parametri.Naziv == null) 
      return "ARKOD TRAŽILICA";
    else
      return this.parametri.Naziv + ' (' + this.izvidnikProvider.parametriIzv.Povrsina + ' m2)';
  }

    isInsertButtonDisabled(): boolean {
      if (this.parametri.ID != null && this.kultureid != null)
        return false;

      return true;

    }

    change(value){
      //manually launch change detection
      this.cdRef.detectChanges();
      this.sljedeciMonitoring = value.length > 3 ? value.substring(0,3) : value;
    }
  
  }

