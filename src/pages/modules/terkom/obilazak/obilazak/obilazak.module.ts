import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomObilazakPage } from './obilazak';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomObilazakPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomObilazakPage),
    ComponentsModule
  ],
  exports: [
    TerkomObilazakPage
  ]
})
export class TerkomObilazakPageModule {}