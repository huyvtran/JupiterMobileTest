import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproIzvjestajiRealizacijaPage } from './realizacija';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproIzvjestajiRealizacijaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproIzvjestajiRealizacijaPage),
    ComponentsModule
  ],
  exports: [
    TerproIzvjestajiRealizacijaPage
  ]
})
export class TerproIzvjestajiRealizacijaPageModule {}