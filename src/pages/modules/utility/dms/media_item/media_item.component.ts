
import { Component, Input } from '@angular/core'
import { MediaRef } from "./media_ref";


import { BasePage } from '../../../../../providers/base/base-page';
import * as ICore from '../../../../../interfaces/iCore';
import { UtilityDMSService } from '../../../../../providers/modules/utility/utility-dms-provider';


@Component({
  selector: 'app-media-item',
  templateUrl: "media_item.component.html"
})

export class MediaItem extends BasePage {

  @Input() media: MediaRef;

  dokument: string;
  constructor(
    private dmsProvider: UtilityDMSService,

  ) {

    super()

  }



  showFile(item) {
    this.variable.loaderActive = true;
    console.log(item)
    this.getDetails(item.id).then(x => {
      this.dokument = x.dokblob;
      console.log(x)
    })
      .then((res) => {
        //konvertiraj
        this.dmsProvider.saveFileOnDevice(this.dokument, item.naziv);
      })
      .catch((err) => {
        this.variable.loaderActive = false;
        this.global.logError(err, true);
      })
  }



  getDetails(dokid) {
    let dataDef: ICore.IData = {
      "queries": [
        {
          "query": "spMobDmsQuery",
          "params": {
            "action": "getDoc",
            "dokId": dokid,
            "ParentFolderId": null,
          },
          "singlerow": true
        }
      ]
    }
    return this.global.getData(dataDef);

  }

}
