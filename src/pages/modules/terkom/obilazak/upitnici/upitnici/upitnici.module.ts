import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomUpitniciPage } from './upitnici';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomUpitniciPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomUpitniciPage),
    ComponentsModule
  ],
  exports: [
    TerkomUpitniciPage
  ]
})
export class TerkomUpitniciPageModule {}