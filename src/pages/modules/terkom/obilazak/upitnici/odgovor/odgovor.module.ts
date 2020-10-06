import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TerkomUpitniciOdgovorPage } from './odgovor';
import { ComponentsModule } from '../../../../../../components/components.module';
 
@NgModule({
  declarations: [
    TerkomUpitniciOdgovorPage,
  ],
  imports: [
    IonicPageModule.forChild(TerkomUpitniciOdgovorPage),
    ComponentsModule
  ],
  exports: [
    TerkomUpitniciOdgovorPage
  ]
})
export class TerkomUpitniciOdgovorPageModule {}