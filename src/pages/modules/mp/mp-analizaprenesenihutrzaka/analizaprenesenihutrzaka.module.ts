import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { MPAnalizaprenesenihutrzakaPage } from './analizaprenesenihutrzaka';
import { ComponentsModule } from '../../../../components/components.module';

@NgModule({
  declarations: [
    MPAnalizaprenesenihutrzakaPage,
  ],
  imports: [
    IonicPageModule.forChild(MPAnalizaprenesenihutrzakaPage),
    ComponentsModule
  ],
  exports: [
    MPAnalizaprenesenihutrzakaPage
  ]
})
export class MPAnalizaprenesenihutrzakaPageModule {}
