import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomRobaPage } from './roba';
import { ComponentsModule } from '../../../../../components/components.module';

 
@NgModule({
  declarations: [
    TerkomRobaPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomRobaPage),
    ComponentsModule
  ],
  exports: [
    TerkomRobaPage
  ]
})
export class TerkomRobaPageModule {}