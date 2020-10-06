import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { UtilityOdobravanjePregledViewPage } from './pregled-view';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    UtilityOdobravanjePregledViewPage,
  ],
  imports: [
    IonicPageModule.forChild(UtilityOdobravanjePregledViewPage),
    ComponentsModule
  ],
  exports: [
    UtilityOdobravanjePregledViewPage
  ]
})
export class UtilityOdobravanjePregledViewPageModule {}
