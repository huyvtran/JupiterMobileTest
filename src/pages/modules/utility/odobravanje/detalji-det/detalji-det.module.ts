import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityOdobravanjeDetaljiDetPage } from './detalji-det';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityOdobravanjeDetaljiDetPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityOdobravanjeDetaljiDetPage),
    ComponentsModule
  ],
  exports: [
    UtilityOdobravanjeDetaljiDetPage
  ]
})
export class UtilityOdobravanjeDetaljiDetPageModule {}
