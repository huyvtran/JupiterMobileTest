import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestBarcodePage } from './barcode';

@NgModule({
  declarations: [
    TestBarcodePage,
  ],
  imports: [
    IonicPageModule.forChild(TestBarcodePage)
  ],
  exports: [
    TestBarcodePage
  ]
})
export class TestBarcodePageModule {}
