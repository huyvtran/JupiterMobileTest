import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopisNeposlanihPage } from './popis-neposlanih';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    PopisNeposlanihPage,
  ],
  imports: [
    IonicPageModule.forChild(PopisNeposlanihPage),
    ComponentsModule
  ],
  exports: [
    PopisNeposlanihPage
  ]
})
export class PopisNeposlanihPageModule {}
