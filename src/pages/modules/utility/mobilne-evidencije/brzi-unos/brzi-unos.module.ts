import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityMobEvRadniNaloziBrziUnosPage } from './brzi-unos';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityMobEvRadniNaloziBrziUnosPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityMobEvRadniNaloziBrziUnosPage),
    ComponentsModule
  ],
  exports: [
    UtilityMobEvRadniNaloziBrziUnosPage
  ]
})
export class UtilityMobEvRadniNaloziBrziUnosPageModule {}
