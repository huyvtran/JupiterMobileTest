import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityOdobravanjeListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityOdobravanjeListaPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityOdobravanjeListaPage),
    ComponentsModule
  ],
  exports: [
    UtilityOdobravanjeListaPage
  ]
})
export class UtilityOdobravanjeListaPageModule {}