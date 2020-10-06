import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityMobEvRadniNaloziZakljuciPage } from './zakljuci';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityMobEvRadniNaloziZakljuciPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityMobEvRadniNaloziZakljuciPage),
    ComponentsModule
  ],
  exports: [
    UtilityMobEvRadniNaloziZakljuciPage
  ]
})
export class UtilityMobEvRadniNaloziZakljuciPageModule {}
