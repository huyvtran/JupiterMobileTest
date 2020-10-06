import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventuraOffTrazilicarobePage } from './inventura-off-trazilicarobe';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    InventuraOffTrazilicarobePage,
  ],
  imports: [
    IonicPageModule.forChild(InventuraOffTrazilicarobePage),
    ComponentsModule
  ],
  exports: [
    InventuraOffTrazilicarobePage
  ]
})
export class InventuraOffTrazilicarobePageModule {}
