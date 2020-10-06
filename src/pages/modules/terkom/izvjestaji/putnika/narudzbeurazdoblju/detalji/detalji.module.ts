import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljeDetaljiPage } from './detalji';
import { ComponentsModule } from '../../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljeDetaljiPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljeDetaljiPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljeDetaljiPage
  ]
})
export class TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljeDetaljiPageModule {}