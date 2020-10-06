import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmOdsustvaOdobravanjeDetPage } from './odobravanje-det';

import { ComponentsModule } from '../../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmOdsustvaOdobravanjeDetPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HrmOdsustvaOdobravanjeDetPage),
  ],
})
export class HrmOdsustvaOdobravanjeDetPageModule {}
