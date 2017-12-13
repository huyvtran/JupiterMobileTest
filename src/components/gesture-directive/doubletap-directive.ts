import {Directive, ElementRef, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {Gesture} from 'ionic-angular';

import * as Hammer from 'hammerjs';

@Directive({
  selector: '[doubleTap]' // Attribute selector
})


export class DoubletapDirective implements OnInit,
OnDestroy {
    @Output() dblTap = new EventEmitter<any>();
    el : HTMLElement;
    //pressGesture : Gesture;
    doubleTap : Gesture;


    constructor(el : ElementRef) {
        this.el = el.nativeElement;
    }

    ngOnInit() {
        //double tap
        this.doubleTap = new Gesture(this.el, {
            recognizers: [
                [
                    Hammer.Tap, {
                        pointers: 2
                    }
                ]
            ]
        });
        this
            .doubleTap
            .listen();
        this
            .doubleTap
            .on('tap', e => {
                this.dblTap.emit();  
        })

    //long press
    // this.pressGesture = new Gesture(this.el, {
    //   recognizers: [
    //     [
    //       Hammer.Press, {
    //         time: 2000
    //       }
    //     ]
    //   ]
    // });
    // this
    //   .pressGesture
    //   .listen();
    // this
    //   .pressGesture
    //   .on('press', e => {
    //     alert("LogOut");
    //     console.log('pressed!!');
    //   })
  }

  ngOnDestroy() {
    this
      .doubleTap
      .destroy();
  }
}