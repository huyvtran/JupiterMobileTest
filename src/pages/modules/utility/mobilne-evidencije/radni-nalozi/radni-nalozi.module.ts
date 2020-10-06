import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../../../../components/components.module';
import { UtilityMobEvRadniNaloziPage } from './radni-nalozi';
import { PipesModule } from '../../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    UtilityMobEvRadniNaloziPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityMobEvRadniNaloziPage),
    ComponentsModule,
    PipesModule
  ],
  exports: [
    UtilityMobEvRadniNaloziPage
  ]
})
export class UtilityMobEvRadniNaloziPageModule {}
