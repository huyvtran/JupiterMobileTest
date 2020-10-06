import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproKomunikacijaPage } from './komunikacija';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproKomunikacijaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproKomunikacijaPage),
    ComponentsModule
  ],
  exports: [
    TerproKomunikacijaPage
  ]
})
export class TerproKomunikacijaPageModule {}