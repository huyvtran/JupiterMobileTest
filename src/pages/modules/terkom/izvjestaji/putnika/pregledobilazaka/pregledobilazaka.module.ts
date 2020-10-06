import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaPregledObilazakaPage } from './pregledobilazaka';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaPregledObilazakaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaPregledObilazakaPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaPregledObilazakaPage
  ]
})
export class TerkomIzvjestajiPutnikaPregledObilazakaPageModule {}