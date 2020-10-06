import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventuraOffUnoskolicinePage } from './inventura-off-unoskolicine';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    InventuraOffUnoskolicinePage,
  ],
  imports: [
    IonicPageModule.forChild(InventuraOffUnoskolicinePage),
    ComponentsModule
  ],
  exports: [
    InventuraOffUnoskolicinePage
  ]
})
export class InventuraOffUnoskolicinePageModule {}
