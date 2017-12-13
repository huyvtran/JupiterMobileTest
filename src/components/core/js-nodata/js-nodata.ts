import {Component, Input} from '@angular/core';

@Component({
  selector: 'js-nodata',
  templateUrl: 'js-nodata.html'
})
export class JsNoDataComponent {
  @Input() message : string = "Nema podataka";
  
  constructor() {
    
  }
}
