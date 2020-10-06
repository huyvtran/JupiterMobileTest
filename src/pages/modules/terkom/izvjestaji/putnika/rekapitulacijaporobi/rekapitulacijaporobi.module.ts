import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomIzvjestajiPutnikaRekapitulacijaPoRobiPage } from './rekapitulacijaporobi';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomIzvjestajiPutnikaRekapitulacijaPoRobiPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomIzvjestajiPutnikaRekapitulacijaPoRobiPage),
    ComponentsModule
  ],
  exports: [
    TerkomIzvjestajiPutnikaRekapitulacijaPoRobiPage
  ]
})
export class TerkomIzvjestajiPutnikaRekapitulacijaPoRobiPageModule {}