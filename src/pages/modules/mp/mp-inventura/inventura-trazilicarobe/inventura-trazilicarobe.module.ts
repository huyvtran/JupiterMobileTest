import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventuraTrazilicarobePage } from './inventura-trazilicarobe';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    InventuraTrazilicarobePage,
  ],
  imports: [
    IonicPageModule.forChild(InventuraTrazilicarobePage),
    ComponentsModule
  ],
  exports: [
    InventuraTrazilicarobePage
  ]
})
export class InventuraTrazilicarobePageModule {}
