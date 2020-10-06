import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproObilazakPage } from './obilazak';
import { ComponentsModule } from '../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerproObilazakPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproObilazakPage),
    ComponentsModule
  ],
  exports: [
    TerproObilazakPage
  ]
})
export class TerproObilazakPageModule {}