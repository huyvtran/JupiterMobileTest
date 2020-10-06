import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljePage } from './preglednarudzbi';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljePage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljePage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljePage
  ]
})
export class TerkomIzvjestajiPutnikaPregledNarudzbiRazdobljePageModule {}