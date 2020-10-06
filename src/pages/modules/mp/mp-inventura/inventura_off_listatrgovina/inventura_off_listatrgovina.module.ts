import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventuraOffListatrgovinaPage } from './inventura_off_listatrgovina';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    InventuraOffListatrgovinaPage,
  ],
  imports: [
    IonicPageModule.forChild(InventuraOffListatrgovinaPage),
    ComponentsModule
  ],
  exports: [
    InventuraOffListatrgovinaPage
  ]
})
export class InventuraOffListatrgovinaPageModule {}
