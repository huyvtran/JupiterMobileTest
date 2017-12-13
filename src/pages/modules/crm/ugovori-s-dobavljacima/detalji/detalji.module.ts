import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMUgovoriSDobavljacimaDetaljiPage } from './detalji';
import { ComponentsModule } from '../../../../../components/components.module';
//import { CurrencyFormat } from '../../../../../pipes/currency-format';

@NgModule({
  declarations: [
    CRMUgovoriSDobavljacimaDetaljiPage,
    //CurrencyFormat
  ],
  imports: [
    IonicPageModule.forChild(CRMUgovoriSDobavljacimaDetaljiPage),
    ComponentsModule
  ],
  exports: [
    CRMUgovoriSDobavljacimaDetaljiPage
  ]
})
export class CRMUgovoriSDobavljacimaDetaljiPageModule {}
