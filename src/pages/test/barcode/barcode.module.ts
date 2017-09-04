import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestBarcodePage } from './barcode';

import { ComponentsModule } from '../../../components/components.module';

@NgModule({
  declarations: [
    TestBarcodePage,
  ],
  imports: [
    IonicPageModule.forChild(TestBarcodePage),
    ComponentsModule
  ],
  exports: [
    TestBarcodePage
  ]
})
export class TestBarcodePageModule {}
