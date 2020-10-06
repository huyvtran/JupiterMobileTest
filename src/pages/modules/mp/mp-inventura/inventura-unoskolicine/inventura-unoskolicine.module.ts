import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventuraUnoskolicinePage } from './inventura-unoskolicine';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    InventuraUnoskolicinePage,
  ],
  imports: [
    IonicPageModule.forChild(InventuraUnoskolicinePage),
    ComponentsModule
  ],
  exports: [
    InventuraUnoskolicinePage
  ]
})
export class InventuraUnoskolicinePageModule {}
