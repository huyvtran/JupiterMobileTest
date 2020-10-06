import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraImovinaPostavkeModalPage } from './imovinaPostavke-modal';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityInventuraImovinaPostavkeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraImovinaPostavkeModalPage),
    ComponentsModule
  ],
})
export class UtilityInventuraImovinaPostavkeModalPageModule {}

