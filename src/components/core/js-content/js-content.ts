import { Component, Input, trigger, transition, animate, style } from '@angular/core';

import { VariableProvider } from '../../../providers/core/variable-provider';

@Component({
  selector: 'js-content',
  templateUrl: 'js-content.html',
  animations: [
    trigger('fadeInOut', [
      // transition(':enter', [   // :enter is alias to 'void => *'
      //   style({opacity:0}),
      //   animate(200, style({opacity:1})) 
      // ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(600, style({opacity:0})) 
      ])
    ])
  ]
})
export class JsContentComponent {

  @Input() title : string = "...";

  get loaderActive(): boolean {return this.variable.loaderActive};

  constructor(private variable: VariableProvider) {
    
  }
}
