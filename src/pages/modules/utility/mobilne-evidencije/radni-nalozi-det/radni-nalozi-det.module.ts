import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ComponentsModule } from '../../../../../components/components.module';
import { UtilityMobEvRadniNaloziDetPage } from './radni-nalozi-det';

@NgModule({
  declarations: [
    UtilityMobEvRadniNaloziDetPage
  ],
  imports: [
    IonicPageModule.forChild(UtilityMobEvRadniNaloziDetPage),
    ComponentsModule
  ],
  exports: [
    UtilityMobEvRadniNaloziDetPage
  ]
})
export class UtilityMobEvRadniNaloziDetPageModule {}
