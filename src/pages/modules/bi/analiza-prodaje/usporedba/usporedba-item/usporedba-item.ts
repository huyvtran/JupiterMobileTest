import {Component, Input} from '@angular/core';

@Component({selector: 'usporedba-item', templateUrl: 'usporedba-item.html'})
export class BiAnalizaProdajeUsporedbaItem {
  @Input() caption : string;
  @Input() valueA : any;
  @Input() valueB : any;
  @Input() includeB : boolean = true;
  @Input() highlight : boolean = false;

  constructor() {}

  setClasses() {
    return {
      includeB: this.includeB,
      excludeB: !this.includeB,
      highlight: this.highlight
    }
  }

}
