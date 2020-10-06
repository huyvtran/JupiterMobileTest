import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomPitanjaPage } from './pitanja';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomPitanjaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomPitanjaPage),
    ComponentsModule
  ],
  exports: [
    TerkomPitanjaPage
  ]
})
export class TerkomPitanjaPageModule {}