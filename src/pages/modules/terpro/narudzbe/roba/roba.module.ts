import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerproRobaPage } from './roba';
import { ComponentsModule } from '../../../../../components/components.module';

 
@NgModule({
  declarations: [
    TerproRobaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerproRobaPage),
    ComponentsModule
  ],
  exports: [
    TerproRobaPage
  ]
})
export class TerkoTerproRobaPageModule {}