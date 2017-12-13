import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HrmGodisnjEvidencijaDetPage } from './evidencija-det';

import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    HrmGodisnjEvidencijaDetPage,
  ],
  imports: [
    IonicPageModule.forChild(HrmGodisnjEvidencijaDetPage),
    ComponentsModule
  ],
})
export class HrmGodisnjEvidencijaDetPageModule {}
