import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UtilityMobEvRadniNaloziIzmjenaNapomeneModalPage } from './radni-nalozi-izmjena-napomene-modal';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityMobEvRadniNaloziIzmjenaNapomeneModalPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityMobEvRadniNaloziIzmjenaNapomeneModalPage),
    ComponentsModule
  ],
  exports: [
    UtilityMobEvRadniNaloziIzmjenaNapomeneModalPage
  ]
})
export class UtilityMobEvRadniNaloziIzmjenaNapomeneModalPageModule {}
