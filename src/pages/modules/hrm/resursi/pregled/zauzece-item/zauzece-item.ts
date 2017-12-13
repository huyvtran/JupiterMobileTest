import {Component, Input} from '@angular/core';
import * as Moment from 'moment';

@Component({selector: 'zauzece-item', templateUrl: 'zauzece-item.html'})
export class HrmResursiZauzeceItemComponent {
  @Input()data : any;

  constructor() {}

  formatRazdoblje(item) : string {
    var datumOd = item.datumod;
    var datumDo = item.datumdo;
    var momentOd = Moment(datumOd).format("DD.MM.YYYY");
    var momentDo = Moment(datumDo).format("DD.MM.YYYY");

    // <span>{{zauzece?.datumod | date:
    // 'dd.MM.yyyy'}}</span><br>{{zauzece?.vrijemeod}} - {{zauzece?.vrijemedo}}

    if (momentOd == momentDo) 
      return "<span>" + momentOd + "</span><br>" + item.vrijemeod + " - " + item.vrijemedo;
    else 
      return "<span>" + momentOd + " " + item.vrijemeod + "</span><br><span>" + momentDo + " " + item.vrijemedo + "</span>";

      //return vrijemeOd;
    }
  
}
