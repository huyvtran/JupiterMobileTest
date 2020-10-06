import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomKomunikacijaPage } from './komunikacija';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomKomunikacijaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomKomunikacijaPage),
    ComponentsModule
  ],
  exports: [
    TerkomKomunikacijaPage
  ]
})
export class TerkomKomunikacijaPageModule {}