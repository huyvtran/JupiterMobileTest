import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiLokacijeOtvoreniRacuniPage } from './otvoreniracuni';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiLokacijeOtvoreniRacuniPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiLokacijeOtvoreniRacuniPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiLokacijeOtvoreniRacuniPage
  ]
})
export class TerkomIzvjestajiPutnikaPregledObilazakaPageModule {}