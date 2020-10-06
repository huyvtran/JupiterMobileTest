import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraSinkronizacijaModalPage } from './sinkronizacija-modal';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityInventuraSinkronizacijaModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraSinkronizacijaModalPage),
    ComponentsModule
  ],
})
export class UtilityInventuraSinkronizacijaModalPageModule {}

