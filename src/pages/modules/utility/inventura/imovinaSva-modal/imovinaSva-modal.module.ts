import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityInventuraImovinaSvaModalPage } from './imovinaSva-modal';

import { ComponentsModule } from '../../../../../components/components.module';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    UtilityInventuraImovinaSvaModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityInventuraImovinaSvaModalPage),
    PipesModule,
    ComponentsModule
  ],
})
export class UtilityInventuraImovinaSvaModalPageModule {}

