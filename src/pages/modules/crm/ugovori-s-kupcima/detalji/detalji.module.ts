import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMPregledUgovoraDetaljiPage } from './detalji';
import { ComponentsModule } from '../../../../../components/components.module';
//import { CurrencyFormat } from '../../../../../pipes/currency-format';

@NgModule({
  declarations: [
    CRMPregledUgovoraDetaljiPage,
    //CurrencyFormat
  ],
  imports: [
    IonicPageModule.forChild(CRMPregledUgovoraDetaljiPage),
    ComponentsModule
  ],
  exports: [
    CRMPregledUgovoraDetaljiPage
  ]
})
export class CRMPregledUgovoraDetaljiPageModule {}
