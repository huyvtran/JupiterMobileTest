
import {Injectable} from '@angular/core';

import {GlobalProvider} from '../../../core/global-provider';
import * as ICore from '../../../../interfaces/ICore';
import { ToastController } from 'ionic-angular';

@Injectable()
export class UtilityMobEvProvider {

  Status:any = null
  Zakljucak:any = null
  kkvalglaid:number
  naloziIzmijenjeni:boolean = false
  SearchString : string = ''
  ScanInd : boolean = false
  
  constructor(private global: GlobalProvider, public toast: ToastController) {
      
  }

  getHomePageData(skladisteid:number) {
    let properties : ICore.IProperties = {
      errorMessageCloseButton: true,
      showLoader: false
    }

    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobKKval",
          "params": {
            "action": "getSkladista"
          },
          "tablename":"skladista"
        },
        {
          "query": "spMobKKval",
          "params": {
            "action": "getOdabirKontroleList"
            },
          "tablename":"kontrole"
        }, 
        {
          "query": "spMobKKval",
          "params": {
            "action": "otvoreninalozi",
            "skladisteid" : skladisteid
          },
          "tablename":"nalozi"
        }
      ]
    };

    return this.global.getData(dataDef, properties);
  }

  getSkladista() {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true,
        showLoader: false
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "getSkladista"
        },
        "tablename":"skladista"
        }
    ]
    };

    return this.global.getData(dataDef, properties);

    }

  getRadniNalozi(skladisteid:number = null) {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "otvoreninalozi",
          "skladisteid" : skladisteid
        },
        "tablename":"nalozi"
        }
    ]
    };

    return this.global.getData(dataDef, properties);

    }

    updateRadniNalozi(kkvaldetid:number, stringval:string, boolval:number, decimalValue:number) {
      let properties : ICore.IProperties = {
          errorMessageCloseButton: true
      }
  
      let dataDef: ICore.IData = {
      "queries": [
          {
          "query": "spMobKKval",
          "params": {
            "action": "update",
            "kkvaldetid": kkvaldetid,
            "stringval":stringval,
            "boolval":boolval,
            "decval":decimalValue
          }
          }
      ]
      };
  
      return this.global.getData(dataDef, properties);
  
      } 


      
    Zakljuci() {
      let properties : ICore.IProperties = {
          errorMessageCloseButton: true
      }

      let dataDef: ICore.IData = {
      "queries": [
          {
          "query": "spMobKKval",
          "params": 
            {
              "action": "zakljuci",
              "status": this.Zakljucak,
              "kkvalglaid":this.kkvalglaid,
              "kkvalstatusid": this.Status
            }
          }]
      };
      return this.global.getData(dataDef, properties);
    } 

  insertKontrola(insertObject:any) {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "insert",
          "kkvalglaid":insertObject.kkvalglaid,
          "kkvallnparametarrobaid":insertObject.kkvallnparametarrobaid,
          "stringval":insertObject.stringval,
          "boolval":insertObject.boolval,
          "decval":insertObject.decimalValue,
          "opis":insertObject.opis,
          "orgshemaid":insertObject.orgshemaid,
          "osobeid":insertObject.osobeid,
          "uzorak":insertObject.uzorak
        }
      }
    ]
    };
    return this.global.getData(dataDef, properties);
    } 

    deleteKontrola(kkvaldetid:number) {
      let properties : ICore.IProperties = {
          errorMessageCloseButton: true
      }
  
      let dataDef: ICore.IData = {
      "queries": [
          {
          "query": "spMobKKval",
          "params": {
            "action": "delete",
            "kkvaldetid":kkvaldetid,
          }
          }
      ]
      };
      return this.global.getData(dataDef, properties);
    }
  
  getDetalji(id:number) {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "detalji",
          "KKvalGlaId":id
          },
          "tablename":"detalji"
        }
    ]
    };

    return this.global.getData(dataDef, properties)
    .then((res) => {
      console.log(res)
      return res
    });
  }

  dodajKontrolniUzorak(kkvalglaid:number){
    let properties : ICore.IProperties = {
      errorMessageCloseButton: true
  }

  let dataDef: ICore.IData = {
  "queries": [
      {
      "query": "spMobKKval",
      "params": {
        "action": "dodajKontrolniUzorak",
        "KKvalGlaId": kkvalglaid
        },
        "tablename":"noviKontrolniUzorak"
      }
  ]
  };

  return this.global.getData(dataDef, properties);
  }
  

  clearZakljucakData(){
    this.Status = null
    this.Zakljucak = null
  }

  getKontigentStatus(kkvalglaid:number){
    let properties : ICore.IProperties = {
      errorMessageCloseButton: true
  }

  let dataDef: ICore.IData = {
  "queries": [
      {
      "query": "spMobKKval",
      "params": {
        "action": "getKontigentStatus",
        "kkvalglaid": kkvalglaid
        }
      }
  ]
  };

  return this.global.getData(dataDef, properties);
  }

spremiKontroluUzorka(kkvaldetid:number, decimalValue:string, stringval:string, boolval:number, showLoader:boolean = true){

  let properties : ICore.IProperties = {
    errorMessageCloseButton: true,
    showLoader: showLoader
}

let dataDef: ICore.IData = {
"queries": [
    {
    "query": "spMobKKval",
    "params": {
      "action": "update",
      "kkvaldetid": kkvaldetid,
      "decval": decimalValue,
      "stringval": stringval,
      "boolval": boolval
      },
      "tablename":"kontrole"
    }
]
};

  return this.global.getData(dataDef, properties);
  }

  getStatusi() {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "getStatusi"
          },
          "tablename":"statusi"
        }
    ]
    };

    return this.global.getData(dataDef, properties);
  }


presentToast(message: any) {
  let toast = this.toast.create({
    message: message,
    duration: 2000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

  spremiNapomenu(kkvaldetid:any, opis:string){
    console.log(kkvaldetid + ', ' + opis)
    let properties : ICore.IProperties = {
      errorMessageCloseButton: true,
      showLoader: false
    }


    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobKKval",
          "params": {
            "action": "spremiNapomenu",
            "KKvalDetId": kkvaldetid,
            "Opis": opis
          }
        }
      ]
    };
  return this.global.getData(dataDef, properties);
  }



  getKontroleList() {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true,
        showLoader: false
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "getOdabirKontroleList"
          }
        }
    ]
    };

    return this.global.getData(dataDef, properties);
  }


  
  getFiltriraneKontrole(kkvalparametriid : number, skladisteid:number = null) {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "getFiltriraneKontrole",
          "kkvalparametriid" : kkvalparametriid,
          "skladisteid" : skladisteid
          }
        }
    ]};
    return this.global.getData(dataDef, properties);
  }


  getKontrolePoRobi(robaid:number) {
    let properties : ICore.IProperties = {
        errorMessageCloseButton: true
    }

    let dataDef: ICore.IData = {
    "queries": [
        {
        "query": "spMobKKval",
        "params": {
          "action": "getKontrolePoRobiList",
          "RobaId": robaid
        },
        "tablename":"kontrole"
        }
    ]
    };

    return this.global.getData(dataDef, properties);

    }
}

export interface IParametri {
  action: string,
  kkvaldetid: number,
  decimalValue : number,
  stringval: string,
  boolval: number
}
