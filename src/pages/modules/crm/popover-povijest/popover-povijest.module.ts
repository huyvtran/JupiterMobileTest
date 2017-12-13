import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverPovijestPage } from './popover-povijest';

@NgModule({
  declarations: [
    PopoverPovijestPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverPovijestPage),
  ],
  exports: [
    PopoverPovijestPage
  ]
})
export class PopoverPovijestPageModule {}
