import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmOdsustvaOdobravanjePage } from './odobravanje';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmOdsustvaOdobravanjePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HrmOdsustvaOdobravanjePage),
  ],
})
export class HrmOdsustvaOdobravanjePageModule {}
